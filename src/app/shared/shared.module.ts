import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componets/header/header.component';
import { FooterComponent } from './componets/footer/footer.component';
import { SidemenuComponent } from './componets/sidemenu/sidemenu.component';
import { TapToTopComponent } from './componets/tap-to-top/tap-to-top.component';
import { LoaderComponent } from './componets/loader/loader.component';
import { NotificationSidebarComponent } from './componets/notification-sidebar/notification-sidebar.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { SwitcherComponent } from './componets/switcher/switcher.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';
import { HeaderOneComponent } from './componets/header-one/header-one.component';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { LandingpageLayoutComponent } from './layouts/landingpage-layout/landingpage-layout.component';
import { NgxColorsModule } from 'ngx-colors';
import { PageHeaderComponent } from './componets/page-header/page-header.component';
import { ShowCodeDirective } from './directives/show-code.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { OutsideclickDirective } from './directives/outsideclick.directive';
import { FormsModule } from '@angular/forms';
import { SvgReplaceDirective } from './directives/svgReplace.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        NgbNavModule,
        OverlayscrollbarsModule,
        ColorPickerModule,
        NgxColorsModule,
        NgbNavModule,
        FormsModule,
        NgbDropdownModule,
        HeaderComponent,
        FooterComponent,
        SidemenuComponent,
        SwitcherComponent,
        TapToTopComponent,
        LoaderComponent,
        NotificationSidebarComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        FullscreenDirective,
        HoverEffectSidebarDirective,
        ToggleThemeDirective,
        HeaderOneComponent,
        LandingpageLayoutComponent,
        PageHeaderComponent,
        ShowCodeDirective,
        DropdownDirective,
        SvgReplaceDirective,
        OutsideclickDirective
    ],
    exports: [
        PageHeaderComponent,
        LoaderComponent,
        TapToTopComponent,
        FooterComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        ShowCodeDirective
        
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
