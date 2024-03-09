const currentTicketLbl = document.querySelector('#lbl-new-ticket');
const createTicketBtn = document.querySelector('button');


const getLastTicket = async()  =>{
    const lastTicket = await fetch('api/ticket/last').then(response => response.json())
    currentTicketLbl.innerText = `Ticket ${lastTicket}`
   
}
getLastTicket();


const createTicket = async() =>{
    const newTicket = await fetch('api/ticket',{
        method: 'POST',
       
    }).then(response => response.json())
 
    currentTicketLbl.innerText = `Ticket ${newTicket.number}`
  
}
createTicketBtn.addEventListener('click',createTicket)

//(async()=>{
//    await fetch('api/ticket/last')
//    .then(response => response.json())
//    .then(data => { 
//        currentTicketLbl.innerText = `Ticket ${data}`
//    })
//})()







//console.log('Nuevo Ticket HTML');