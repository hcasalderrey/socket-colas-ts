import { Router } from 'express';
import { TicketRouter } from './tickets/router';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/ticket', TicketRouter.routes);



    return router;
  }


}

