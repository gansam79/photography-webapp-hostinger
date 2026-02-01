<main id="main" class="main" ng-controller="sliderServicesCtrl" ng-init="sliderInit()" ng-cloak>

    <div class="pagetitle">
        <h1>Home Slider</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Home Slider</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section">
        <div class="modal fade" id="deletedetails" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                        <div className="font-robo">
                            <div className="">
                                <div className="card card-1 " style="box-shadow: 'none'">
                                    <div className="card-body card-thankyou"
                                        style="padding: '5px 5px'; text-align: 'center'">
                                        <center>
                                            <i class="mdi mdi-alert-circle-outline"
                                                style="font-size: 6.19rem;color: #f9bd4e;"></i>
                                        </center>
                                        <div className='message-submitThankyou'>
                                            <h4 style="text-align: center;" class="mt-3">Are you sure you want to delete
                                                this slider?
                                            </h4>
                                            <p style="text-align: center; color:red;" class="mt-1 mb-0">Once deleted it
                                                cannot be
                                                recovered.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-sm"
                            ng-click="confirmDeleteSliderClick()">Yes</button>
                        <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12">
            <div class="card shadow-sm">
                <div class="card-body">
                    <!-- Header with Title and Add Button -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title">Home Slider</h5>
                        <div>
                            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#addEditModal" onclick="clearModal()">
                                <i class="bi bi-plus-circle me-1"></i> Add New
                            </button>
                        </div>
                    </div>

                    <!-- Add/Edit Modal -->
                    <div class="modal fade" id="addEditModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header text-black">
                                    <h5 class="modal-title" id="modalTitle">Add New Image</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="sliderForm" class="row g-3">
                                        <!-- Image Upload -->
                                        <div class="col-12">
                                            <label for="fileInput" class="form-label">Image<em>*</em></label>
                                            <input type="file" class="form-control" id="fileInput"
                                                onchange="angular.element(this).scope().setSliderImage(this)"
                                                accept="image/*">
                                        </div>
                                        <!-- Title -->
                                        <div class="col-12">
                                            <label for="inputTitle" class="form-label">Title<em>*</em></label>
                                            <input type="text" class="form-control" id="sliderTitle" name="sliderTitle"
                                                ng-model="sliderTitle" placeholder="Enter title">
                                        </div>
                                        <!-- Show In Page -->
                                        <div class="col-12">
                                            <label for="inputShowInPage" class="form-label">Show in Page</label>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="isSliderShowFlag"
                                                    ng-model="isSliderNameShowFlag" checked />
                                            </div>
                                        </div>
                                        <!-- Created Date -->
                                        <!-- <div class="col-12">
                                            <label for="inputCreatedDate" class="form-label">Created Date</label>
                                            <input type="date" class="form-control" id="inputCreatedDate">
                                        </div> -->
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary btn-sm"
                                        data-bs-dismiss="modal">Close</button>
                                    <!-- <button type="button" class="btn btn-primary btn-sm" onclick="saveChanges()">Save
                                        Changes</button> -->
                                    <button ng-if="!isSliderEdit  && !isDisplayProgrss" type="button"
                                        class="btn btn-primary btn-sm" ng-click="insertNewSlider()">Save
                                        Changes
                                    </button>
                                    <button id="updateUserdetais" type="button" class="btn btn-primary btn-sm"
                                        ng-click="editSlider()"
                                        ng-if="isSliderEdit && !isDisplayProgrss">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="table table-hover align-middle datatable">
                        <thead>
                            <tr>
                                <th style="width:25%;">Image</th>
                                <th style="width:25%;">Title</th>
                                <th>Show In Page</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="sliderTableBody">
                            <tr ng-repeat="slider in allSliderList">
                                <td>
                                    <img src="{{base_url + slider.s_image_path}}" alt="Profile" alt="Slide 1"
                                        class="img-fluid rounded" />

                                </td>
                                <td>{{slider.s_title}}</td>
                                <td>
                                    <label class="switch">
                                        <input ng-if="slider.s_visible == 1" type="checkbox" id="checkbox"
                                            ng-click="showOnPage($event.target.checked,slider)" checked>
                                        <input ng-if="slider.s_visible == 0" type="checkbox" id="checkbox"
                                            ng-click="showOnPage($event.target.checked,slider)">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                                <td>{{slider.s_created_at}}</td>
                                <td>
                                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                                        id="editdetails" ng-click="editSliderClick(slider)">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button type="button" class="btn btn-danger btn-sm"
                                        ng-click="deleteSliderclick(slider)" id="deletedetails">
                                        <i class="bi bi-trash"></i>
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
        document.getElementById("modalTitle").innerText = "Add New Image";
        document.getElementById("inputImage").value = "";
        document.getElementById("inputTitle").value = "";
        document.getElementById("inputShowInPage").checked = true;
        document.getElementById("inputCreatedDate").value = "";
    }

    function editRow(button) {
        const row = button.closest("tr");
        const cells = row.getElementsByTagName("td");

        document.getElementById("modalTitle").innerText = "Edit Image";
        document.getElementById("inputImage").value = ""; // Image cannot be prefilled for security
        document.getElementById("inputTitle").value = cells[1].innerText;
        document.getElementById("inputShowInPage").checked = cells[2].getElementsByTagName("input")[0].checked;
        document.getElementById("inputCreatedDate").value = cells[3].innerText;
    }

    function saveChanges() {
        // Logic to save changes or add new row
        alert("Changes saved!");
    }

    function deleteRow(button) {
        const row = button.closest("tr");
        row.remove();
    }
    </script>


    <style>
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 40px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 40px;
    }

    input:checked+.slider {
        background-color: #2196F3;
        border-radius: 40px;
    }

    input:focus+.slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked+.slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
        border-radius: 40px;
    }
    </style>
</main><!-- End #main -->