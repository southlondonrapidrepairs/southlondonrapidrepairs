/* Lead-Capture Handler – plug in your EmailJS / backend here */
document.addEventListener('DOMContentLoaded',()=>{
    const forms=document.querySelectorAll('.lead-form');
    forms.forEach(form=>{
        form.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const data=Object.fromEntries(new FormData(form));
            data.urgency=calcUrgency(data.description);
            data.lead_id='SLR'+Date.now().toString(36).slice(-6).toUpperCase();
            data.timestamp=new Date().toISOString();

            /* ===== REPLACE WITH YOUR EMAIL/SMS SERVICE ===== */
            console.log('Lead to dispatch:',data);
            alert(`✅ Help is on the way!\nWe'll call you within 15 minutes.\nRef: ${data.lead_id}`);

            /* Example EmailJS block (uncomment & fill)
            emailjs.init("YOUR_PUBLIC_KEY");
            await emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
                name:data.name,
                phone:data.phone,
                postcode:data.postcode,
                service:data.service||data.emergency_type,
                urgency:data.urgency,
                message:data.description,
                lead_id:data.lead_id
            });
            */
            form.innerHTML=`<div style="text-align:center"><h3>✅ Help is on the way!</h3><p>We'll call you within 15 minutes.<br>Your ref: <strong>${data.lead_id}</strong></p></div>`;
        });
    });
    function calcUrgency(desc=''){
        const urgent=['leak','water','flood','collapse','now','urgent','pouring'];
        return urgent.some(w=>desc.toLowerCase().includes(w))?'HIGH':'standard';
    }
});