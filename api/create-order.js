const crypto=require('crypto');
const {db,telegram,sendEmail,pdf,decodeFile,upload}=require('./_lib');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 try{
  const b=req.body||{};const qty=Number(b.quantity),price=Number(b.unitPrice);
  if(!b.customerName||!b.phone||!b.size||!Number.isInteger(qty)||qty<1||qty>50||!Number.isFinite(price)||price<=0||price>5000||!b.photo) return res.status(400).json({error:'សូមពិនិត្យព័ត៌មានកម្មង់ និងរូបថតឡើងវិញ។'});
  const photo=decodeFile(b.photo),receipt=decodeFile(b.receipt);const total=Number((qty*price).toFixed(2));
  const serial=Date.now().toString().slice(-8)+crypto.randomBytes(2).toString('hex').toUpperCase();
  const order={order_number:`CHR-${serial}`,invoice_number:`INV-${serial}`,customer_name:String(b.customerName).slice(0,120),phone:String(b.phone).slice(0,40),telegram_username:String(b.telegramUsername||'').slice(0,80),delivery_address:String(b.address||'').slice(0,500),size:String(b.size).slice(0,60),quantity:qty,unit_price:price,total,payment_status:'PENDING_VERIFICATION'};
  const client=db();const {data:saved,error}=await client.from('orders').insert(order).select('*').single();if(error)throw error;
  const photoPath=`orders/${saved.order_number}/photo.${photo.ext}`;await upload('order-files',photoPath,photo.buffer,photo.type);
  let receiptPath=null;if(receipt){receiptPath=`orders/${saved.order_number}/receipt.${receipt.ext}`;await upload('order-files',receiptPath,receipt.buffer,receipt.type);}
  const invoice=await pdf(saved),invoicePath=`${saved.invoice_number}.pdf`;await upload('invoices',invoicePath,invoice,'application/pdf');
  await client.from('orders').update({photo_storage_path:photoPath,receipt_storage_path:receiptPath,invoice_storage_path:invoicePath,invoice_created_at:new Date().toISOString()}).eq('id',saved.id);
  const summary=`New CHROMALUX order ${saved.order_number}\nInvoice: ${saved.invoice_number}\nCustomer: ${saved.customer_name}\nPhone: ${saved.phone}\nSize: ${saved.size}\nQuantity: ${qty}\nTotal: $${total.toFixed(2)}\nPayment: PENDING MANUAL VERIFICATION\nAddress: ${saved.delivery_address||'Not provided'}\nTelegram: ${saved.telegram_username||'Not provided'}`;
  const outcomes=await Promise.allSettled([
    telegram('sendMessage',{chat_id:process.env.TELEGRAM_ADMIN_CHAT_ID,text:summary}),
    sendEmail(`New CHROMALUX order ${saved.order_number}`,summary,[{filename:`${saved.invoice_number}.pdf`,content:invoice.toString('base64')}])
  ]);
  const failures=outcomes.filter(x=>x.status==='rejected');
  await client.from('orders').update({notification_status:failures.length?'PARTIAL_FAILURE':'SENT'}).eq('id',saved.id);
  if(failures.length){console.error('Notification failures',failures.map(x=>String(x.reason)));return res.status(207).json({ok:true,orderNumber:saved.order_number,invoiceNumber:saved.invoice_number,warning:'Order saved, but one or more notifications failed. Admin settings must be checked.'});}
  return res.status(200).json({ok:true,orderNumber:saved.order_number,invoiceNumber:saved.invoice_number});
 }catch(e){console.error(e);return res.status(500).json({error:e.message||'Could not process order'});}
};
