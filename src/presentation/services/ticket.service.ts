import { Ticket } from "../../domain/interfaces/Ticket";
import { UuidAdapter } from '../../config/uuid.adapter';

export class TicketService {

    public readonly tickets:Ticket[] = [
        { id: UuidAdapter.v4(), number:1, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:2, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:3, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:4, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:5, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:6, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:7, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number:8, createdAt: new Date(), done: false },

    ];

    private readonly workingOnTickets: Ticket[] = [];

    public get pendingTickets():Ticket[]{
        return this.tickets.filter(ticket => !ticket.handleAtDesk )
    }


    public get lastWorkingOnTicket():Ticket[]{
        return this.workingOnTickets.splice(0,4)
        
    }
    public get lastTicketNumber():number {
        return this.tickets.length>0 ? this.tickets.at(-1)!.number : 0;
        
    }

    public createTicket() {
        const ticket:Ticket = { 
            id: UuidAdapter.v4().toString(), 
            number: this.lastTicketNumber+1, 
            createdAt: new Date(), 
            done: false,
            handleAtDesk: undefined,
            handleAt: undefined

        };

        this.tickets.push(ticket);

          // TODO: ENVIAR MENSAJE A WS


        return ticket
    }

    public drawTicket(desk:string) {
        const ticket = this.tickets.find(ticket => !ticket.handleAtDesk)
        if(!ticket) return {status: 'error', message: 'No hay ticket pendientes'  }

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();


        this.workingOnTickets.unshift({...ticket})

        // TODO: ENVIAR MENSAJE A WS

        return {status: 'ok', ticket}
    }

    public ticketFinished(ticketId:string) {
        
        const ticket = this.tickets.find(ticket => ticket.id === ticketId)
        if(!ticket) return {status: 'error', message: 'No existe el ticket'  }
        //ticket.done = true

        //// TODO: ENVIAR MENSAJE A WS

        //return {status: 'ok', ticket}



        this.tickets.map( ticket =>{
            if(ticket.id === ticketId) {
                ticket.done = true
            } 
            return ticket;
        })
        return {status: 'ok'}    

    }



}