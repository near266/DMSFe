import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NgSelectModule } from '@ng-select/ng-select';
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TreeModule } from '@circlon/angular-tree-component';
import { NgPrintModule } from 'ng-print';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EzPaginationComponent } from './components/ez-pagination/ez-pagination.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { MenuCollapseSearchComponent } from './components/menu-collapse-search/menu-collapse-search.component';
import { MenuCollapseTreeComponent } from './components/menu-collapse-tree/menu-collapse-tree.component';
import { MenuCollapseComponent } from './components/menu-collapse/menu-collapse.component';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MenuCollapseTreeMultipleComponent } from './components/menu-collapse-tree-multiple/menu-collapse-tree-multiple.component';

@NgModule({
    declarations: [
        MenuCollapseComponent,
        MenuBarComponent,
        MenuCollapseSearchComponent,
        MenuCollapseTreeComponent,
        EzPaginationComponent,
        ConfirmDialogComponent,
        ConfirmationDialogComponent,
        MenuCollapseTreeMultipleComponent,
    ],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatListModule,
        MatStepperModule,
        MatTabsModule,
        MatTreeModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatBadgeModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatBottomSheetModule,
        MatDialogModule,
        MatSnackBarModule,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        TreeModule,
        NgxPaginationModule,
        NgSelectModule,
        NgPrintModule,
        ClipboardModule,
    ],
    exports: [
        CurrencyMaskModule,
        ConfirmDialogComponent,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MenuBarComponent,
        MatSelectModule,
        MatSliderModule,
        CurrencyMaskModule,
        NgPrintModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatListModule,
        MatStepperModule,
        MenuCollapseComponent,
        MatTabsModule,
        MatTreeModule,
        MatButtonModule,
        MatButtonToggleModule,
        NgSelectModule,
        MatBadgeModule,
        MatChipsModule,
        MatIconModule,
        NgxMatSelectSearchModule,
        MenuCollapseSearchComponent,
        MenuCollapseTreeComponent,
        MenuCollapseTreeMultipleComponent,
        EzPaginationComponent,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatRippleModule,
        MatBottomSheetModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        TreeModule,
        NgxPaginationModule,
        ClipboardModule,
    ],
})
export class SharedModule {}
