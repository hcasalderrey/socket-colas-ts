const lblPending = document.querySelector('#lbl-pending')
const deskHeader = document.querySelector('h1')
const noMoreAlert = document.querySelector('.alert')
const lblCurrentTicket = document.querySelector('small')

const btnDraw = document.querySelector('#btn-draw')
const btnDone = document.querySelector('#btn-done')

const searchParams = new URLSearchParams(window.location.search)

if(!searchParams.has('escritorio')){
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null
deskHeader.innerText = deskNumber

function checkTicketCount( currentCount=0){

    if(currentCount === 0){
        noMoreAlert.classList.remove('d-none')
        lblPending.classList.add('d-none')

    }
    else {
        noMoreAlert.classList.add('d-none')
        lblPending.classList.remove('d-none')

    }
    lblPending.innerHTML = currentCount

}


const loadInitialCount =  async() => {
 const pendingTicket = await fetch('/api/ticket/pending').then(response => response.json())
  
 checkTicketCount (pendingTicket.length) 


}

async function getTicket() {
    await finishTicket()
   const{status, ticket} = await fetch(`/api/ticket/draw/${deskNumber}`)
        .then(resp => resp.json())

    if(status==='error')
    {
        lblCurrentTicket.innerText = 'No hay tickets pendientes'
        return
    }

    workingTicket = ticket
    lblCurrentTicket.innerText = `Ticket ${ticket.number}`
}

async function finishTicket (){
    if(!workingTicket) return

    const {status, message}= await fetch(`/api/ticket/done/${workingTicket.id}`, {
        method: 'PUT'
    }).then(resp => resp.json()) 

    if( status === 'ok'){
        workingTicket = null
        lblCurrentTicket.innerText = 'Nadie'
      
    }
}

function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
      const {type, payload}  = JSON.parse(event.data);
        if(type !=='on-ticket-count-changed')  return  
      checkTicketCount(payload)
    };
  
    socket.onclose = ( event ) => {
      console.log( 'Connection closed' );
      setTimeout( () => {
        console.log( 'retrying to connect' );
        connectToWebSockets();
      }, 1500 );
  
    };
  
    socket.onopen = ( event ) => {
      console.log( 'Connected' );
    };
  
  }


  btnDraw.addEventListener('click', getTicket)
  btnDone.addEventListener('click', finishTicket)
  
  loadInitialCount()
  connectToWebSockets();



 