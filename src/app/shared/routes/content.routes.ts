import { Routes } from "@angular/router";
import { CustomPagesRoutingModule } from "src/app/components/pages/custom-pages/custom-pages.routes";

export const Content_Routes: Routes = [
    {
        path: 'custompages',
         children:[
                  ...CustomPagesRoutingModule.routes,    
                ]
    }
];