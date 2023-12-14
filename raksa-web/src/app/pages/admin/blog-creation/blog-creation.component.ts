import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-blog-creation',
  templateUrl: './blog-creation.component.html',
  styleUrls: ['./blog-creation.component.scss'],
})
export class BlogCreationComponent implements OnInit {
  contentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userServices: UserService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.contentForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      summary: ['', Validators.required],
      hero_image: [''],
      content: ['', Validators.required],
      sections: this.fb.array([]),
      author: ['', Validators.required],
      authored_on: ['', Validators.required],
      slug: ['', Validators.required],
    });
  }

  createSectionFormGroup(): FormGroup {
    return this.fb.group({
      section_title: [''],
      section_image: [''],
      section_content: [''],
    });
  }

  addSection() {
    const sectionsArray = this.contentForm.get('sections') as FormArray;
    sectionsArray.push(this.createSectionFormGroup());

    // Set validators for the new section fields
    const newSectionIndex = sectionsArray.length - 1;
    this.setValidatorsForSection(newSectionIndex);
  }

  onFileSelected(event: any) {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      // Call the API to upload the file
      this.uploadFile(file);
    }
  }
  private uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Make an HTTP request using HttpClient
    this.userServices.GetUploadPicLink(formData).then((data) => {
      data.subscribe((urldata) => {
        this.contentForm.patchValue({ hero_image: urldata['url'] });
      });
    });
  }

  onFileSelected1(event: any, index) {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      // Call the API to upload the file
      this.uploadFile1(file, index);
    }
  }
  private uploadFile1(file: File, index) {
    const sectionsArray = this.contentForm.get('sections') as FormArray;
    const formData = new FormData();
    formData.append('file', file);
    // Make an HTTP request using HttpClient
    this.userServices.GetUploadPicLink(formData).then((data) => {
      data.subscribe((urldata) => {
        sectionsArray.at(index).patchValue({
          section_image: urldata['url'],
        });
      });
    });
  }

  setValidatorsForSection(index: number) {
    const sectionsArray = this.contentForm.get('sections') as FormArray;

    sectionsArray
      .at(index)
      .get('section_title')
      ?.setValidators([Validators.required]);

    sectionsArray
      .at(index)
      .get('section_content')
      ?.setValidators([Validators.required]);

    // Trigger validation update
    sectionsArray.at(index).get('section_title')?.updateValueAndValidity();
    sectionsArray.at(index).get('section_image')?.updateValueAndValidity();
    sectionsArray.at(index).get('section_content')?.updateValueAndValidity();
  }

  removeSection(index: number) {
    const sectionsArray = this.contentForm.get('sections') as FormArray;
    sectionsArray.removeAt(index);
  }

  onSubmit() {
    if (this.contentForm.valid) {
      // The form is valid, proceed with your submission logic
      this.userServices
        .addBlogDataFromSlug(this.contentForm.value)
        .then((data) => {
          this.contentForm.reset();
        });
    } else {
      // The form is invalid, mark all controls as touched to display error messages
      this.markFormGroupTouched(this.contentForm);
    }
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
