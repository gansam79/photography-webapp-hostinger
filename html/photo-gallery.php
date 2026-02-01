<main id="main" class="main" ng-controller="AdminGalleryServicesCtrl" ng-init="AdminGalleryInit()" ng-cloak>
    <div class="pagetitle">
        <h1>Photo Gallery</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Photo Gallery</li>
            </ol>
        </nav>
    </div>
    <div class="modal fade" id="delete-gallery" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm delete?</h5>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="font-robo">
                        <div class="">
                            <div class="card card-1 " style="box-shadow: 'none'">
                                <div class="card-body card-thankyou" style="padding: '5px 5px'; text-align: 'center'">
                                    <center>
                                        <i class="mdi mdi-alert-circle-outline"
                                            style="font-size: 6.19rem;color: #f9bd4e;"></i>
                                    </center>
                                    <div class='message-submitThankyou'>
                                        <h4 style="text-align: center;" class="mt-3">Are you sure you want to delete
                                            this gallery?</h4>
                                        <p style="text-align: center; color:red;" class="mt-1">Once deleted it cannot be
                                            recovered.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="buttonload btn btn-warning btn-sm" disabled ng-if="pleaseWait"><i
                            class="fa fa-spinner fa-spin"></i>Please wait...</button>
                    <button type="button" class="btn btn-primary btn-sm" ng-if="!pleaseWait"
                        ng-click="confirmedDeleteClick()">Yes</button>
                    <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <section class="section">
        <div class="col-lg-12">
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title">Photo Gallery</h5>
                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                            data-bs-target="#addnewGallery" onclick="clearModal()">
                            <i class="bi bi-plus-circle me-1"></i> Add New
                        </button>
                    </div>

                    <!-- Add/Edit Modal -->
                    <div class="modal fade" id="addnewGallery" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitle">Add New Photo Gallery</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="galleryForm" class="row g-3">
                                        <div class="col-md-6">
                                            <label for="galleryTitle" class="form-label">Gallery Title<em>*</em></label>
                                            <input type="text" class="form-control" id="galleryTitle"
                                                ng-model="addEditObject.eventTitle"
                                                ng-disabled="addEditObject.isUploading || pleaseWait"
                                                placeholder="Enter title">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="galleryYear" class="form-label">Year<em>*</em></label>
                                            <select id="eventyear" ng-model="addEditObject.eventYear"
                                                ng-disabled="addEditObject.isUploading || pleaseWait">
                                                class="form-select">
                                                <option value="">Select year</option>
                                                <!-- <option value="2024">2024</option>
                                                <option value="2023">2023</option> -->
                                            </select>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="galleryDescription" class="form-label">Gallery
                                                Description<em>*</em></label>
                                            <textarea class="form-control" ng-model="addEditObject.eventDiscription"
                                                ng-disabled="addEditObject.isUploading || pleaseWait"> rows="3"
                                                placeholder="Enter description"></textarea>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="galleryCategory" class="form-label">Category</label>
                                            <select id="Category" ng-model="addEditObject.Category" class="form-select">
                                                <option selected disabled>Please Select</option>
                                                <option value="Event">Event</option>
                                                <option value="Workshop">Workshop</option>
                                            </select>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="galleryFiles" class="form-label">Upload Images<em>*</em></label>
                                            <input type="file" class="form-control" id="galleryFiles" multiple
                                                accept=".jpg, .jpeg, .png">
                                            <small class="text-muted">You can upload a maximum of 5 files.</small>
                                        </div>
                                    </form>
                                </div>
                                <div ng-if="atlistOneImageIsSelected() || addEditObject.uploadFiles.length > 0">
                                    <ng-container>
                                        <div class="col-md-12 p-3 mb-3"
                                            style="border: 1px solid lightgray;display: inline-block;">
                                            <label class="mb-3"><b>Selected Images</b></label><br />
                                            <div ng-if="fileManagerListArray.length > 0 && atlistOneImageIsSelected()"
                                                style="float: left;margin-top: 17px;"
                                                ng-repeat="FileManager in fileManagerListArray"
                                                ng-show="FileManager.isChecked">
                                                <a style="margin-left: 15px;" href="{{base_url + FileManager.fm_path}}"
                                                    data-title="{{FileManager.fm_name}}" data-lightbox="$index">
                                                    <img src="{{base_url + FileManager.fm_path}}" alt="Image Alt"
                                                        style="height: 60px;width: 101px;border: 3px solid lightgray;border-radius: 4px;">
                                                </a>
                                                <input type="button" id="removeImage1" value="x" class="rmv"
                                                    ng-click="checkboxMedaiLibrayClickHandler('false', $index)" />
                                            </div>
                                            <div style="float: left;margin-top: 17px;"
                                                ng-repeat="file in addEditObject.uploadFiles">
                                                <a style="margin-left: 15px;" href="{{file.dataURL}}"
                                                    data-title="{{file.name}}" data-lightbox="$index+100">
                                                    <img src="{{file.dataURL}}" alt="Image Alt"
                                                        style="height: 60px;width: 101px;border: 3px solid lightgray;border-radius: 4px;">
                                                </a>
                                                <input type="button" id="removeImage1" value="x" class="rmv"
                                                    ng-click="checkboxDropzoneDeleteClickHandler('false', $index)" />
                                            </div>
                                        </div>
                                    </ng-container>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary btn-sm"
                                        data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary btn-sm" ng-click="saveGallery()">{{addEditObject.editId === 0 ? 'Save Gallery' : 'Update
						Gallery'}}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="table table-hover align-middle datatable">
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Gallery Title</th>
                                <th>Year</th>
                                <th>Gallery Category</th>
                                <th># of Photos</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="galleryTableBody">
                            <tr ng-repeat="img in showGalleryObject.galleryListArray">
                                <td style="width: 150px; text-align: center;">
                                    <!-- <div class="gallery-container">
                                        <div class="gallery-item">
                                            <a href="<?php echo base_url('assets/img/product-1.jpg') ?>"
                                                class="glightbox" data-gallery="images-gallery">
                                                <img src="<?php echo base_url('assets/img/product-1.jpg') ?>"
                                                    alt="ISRO Event" class="img-fluid gallery-stacked">
                                            </a>
                                        </div>
                                        <div class="gallery-item">
                                            <a href="<?php echo base_url('assets/img/product-2.jpg') ?>"
                                                class="glightbox" data-gallery="images-gallery">
                                                <img src="<?php echo base_url('assets/img/product-2.jpg') ?>"
                                                    alt="Event Image 2" class="img-fluid gallery-stacked">
                                            </a>
                                        </div>
                                        <div class="gallery-item">
                                            <a href="<?php echo base_url('assets/img/product-3.jpg') ?>"
                                                class="glightbox" data-gallery="images-gallery">
                                                <img src="<?php echo base_url('assets/img/product-3.jpg') ?>"
                                                    alt="Event Image 3" class="img-fluid gallery-stacked">
                                            </a>
                                        </div>
                                    </div> -->
                                    <div class="gallery" ng-if="img.galleryImages.length > 0">
                                        <div class='stack'>
                                            <ng-container ng-repeat="imgPaths in img.galleryImages">
                                                <a href="{{base_url + imgPaths.path}}"
                                                    ng-if="img.galleryImages.indexOf(imgPaths) == 0" class='firstImage'
                                                    data-title="{{imgPaths.caption}}"
                                                    data-lightbox="g{{showGalleryObject.galleryListArray.indexOf(img)}}">
                                                    <img src="{{base_url + imgPaths.path}}" alt="Image Alt">
                                                </a>
                                                <a href="{{base_url + imgPaths.path}}"
                                                    ng-if="img.galleryImages.indexOf(imgPaths) != 0"
                                                    data-title="{{imgPaths.caption}}"
                                                    data-lightbox="g{{showGalleryObject.galleryListArray.indexOf(img)}}"></a>
                                            </ng-container>
                                        </div>
                                    </div>
                                    <div class="gallery-no-images" ng-if="img.galleryImages.length === 0">
                                        <h4>No image is added to the gallery</h4>
                                    </div>
                                </td>
                                <td>{{img.galleryTitle.length < 20 ? img.galleryTitle :
												img.galleryTitle.slice(0, 20).concat('...')}}</td>
                                <td>{{img.eventYear}}</td>
                                <td>Event</td>
                                <td>5</td>
                                <td>
                                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#addEditModal" ng-click="editButtonClick(img.galleryId)">
                                        <i class="bi bi-pencil-square"></i> Edit
                                    </button>
                                    <button type="button" class="btn btn-danger btn-sm"
                                        ng-click="openConfirmationPopup(img.galleryId)">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    </section>
    <script>
    function clearModal() {
        document.getElementById("modalTitle").innerText = "Add New Photo Gallery";
        document.getElementById("galleryTitle").value = "";
        document.getElementById("galleryYear").value = "";
        document.getElementById("galleryDescription").value = "";
        document.getElementById("galleryCategory").value = "";
        document.getElementById("galleryFiles").value = "";
    }

    function editRow(button) {
        const row = button.closest("tr");
        const cells = row.getElementsByTagName("td");

        document.getElementById("modalTitle").innerText = "Edit Photo Gallery";
        document.getElementById("galleryTitle").value = cells[1].innerText;
        document.getElementById("galleryCategory").value = cells[2].innerText;
        document.getElementById("galleryFiles").value = ""; // Files cannot be prefilled
    }

    function deleteRow(button) {
        if (confirm("Are you sure you want to delete this gallery?")) {
            const row = button.closest("tr");
            row.remove();
        }
    }

    function saveChanges() {
        alert("Gallery saved successfully!");
    }
    </script>
</main>