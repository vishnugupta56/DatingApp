import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../Members/Member-edit/Member-edit.component';

// CanDeactivate guard works when we want to call some function on navigating other menu from the define component.
@Injectable()
export class UnsavedChangesPrompt implements CanDeactivate<MemberEditComponent> {
 canDeactivate(component: MemberEditComponent) {
    if (component.EditForm.dirty) {
        return confirm('Are you sure you want to navigate, you will lost unsaved changes');
    }
    return true;
 }

}


