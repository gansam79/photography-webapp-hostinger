<main id="main" class="main" ng-controller="adminManageUsersServicesCtrl" ng-init="manageUsersInit()" ng-cloak>

    <div class="pagetitle">
        <h1>Manage User</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Manage User</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="manage-user">
        <div class="container">
            <div class="row">
                <div class="col-xxl-12 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="manage-main">
                                <div class="manage-name">
                                    <h5 class="card-title">Manage User</h5>
                                </div>
                                <div class="manage-btn">
                                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#verticalycentered2"><i class="bi bi-people me-1"></i> Add
                                        New</button>
                                </div>
                            </div>
                            <div class="modal fade" id="verticalycentered2" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Add New User</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="card2">
                                                <div class="card-body">
                                                    <!-- Vertical Form -->
                                                    <form class="row g-3">
                                                        <!-- Name -->
                                                        <div class="col-12">
                                                            <label for="inputName"
                                                                class="form-label">Name<em>*</em></label>
                                                            <input type="text" class="form-control" ng-model="userName"
                                                                id="userName" placeholder="Enter full name">
                                                        </div>

                                                        <!-- Email -->
                                                        <div class="col-12">
                                                            <label for="inputEmail"
                                                                class="form-label">Email<em>*</em></label>
                                                            <input type="email" class="form-control"
                                                                ng-model="userEmail" id="userEmail"
                                                                placeholder="Enter email">
                                                        </div>
                                                        <div class="col-12">
                                                            <label>WhatsApp No</label>
                                                            <input type="text" class="form-control" maxlength="10"
                                                                ng-model="contactNumber" id="contactNumber"
                                                                placeholder="Enter 10 digit whatsApp number" />
                                                        </div>
                                                        <!-- User Role -->
                                                        <div class="col-12">
                                                            <label for="inputRole" class="form-label">User
                                                                Role<em>*</em></label>
                                                            <select class="form-select" ng-model="UserRole"
                                                                id="UserRole">
                                                                <option selected disabled>Choose role</option>
                                                                <option value="Admin">Admin</option>
                                                                <option value="Editor">Editor</option>
                                                                <option value="Viewer">Viewer</option>
                                                                <option value="Contributor">Contributor</option>
                                                            </select>
                                                        </div>

                                                    </form><!-- Vertical Form -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary btn-sm"
                                                data-bs-dismiss="modal">Close</button>
                                            <button ng-if="EditUserId != '' && pleaseWaitBtn == false" type="button"
                                                class="btn btn-primary btn-sm"
                                                ng-click="modelUpdateUserClick()">Update</button>
                                            <button ng-if="EditUserId == '' && pleaseWaitBtn == false" type="button"
                                                class="btn btn-primary btn-sm" ng-click="modelSaveUserClick()">Save
                                                changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Blocked -->
                            <!--  -->
                            <div class="modal fade" id="confirmationBlockModel" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Add New User</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Confirm {{actionName}}?</h5>
                                                    <button type="button" class="close" data-bs-dismiss="modal"
                                                        aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="font-robo">
                                                        <div class="">
                                                            <div class="card card-1 " style="box-shadow: 'none'">
                                                                <div class="card-body card-thankyou"
                                                                    style="padding: '5px 5px'; text-align: 'center'">
                                                                    <center>
                                                                        <i class="mdi mdi-alert-circle-outline"
                                                                            style="font-size: 6.19rem;color: #f9bd4e;"></i>
                                                                    </center>
                                                                    <div class='message-submitThankyou'>
                                                                        <h4 style="text-align: center;" class="mt-3">Are
                                                                            you sure you want to {{actionName}}?
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-primary btn-sm"
                                                        ng-if="isMultipleDelete"
                                                        ng-click="confirmDeleteMultipleFileManagerFileClick()">Yes</button>
                                                    <button type="button" class="btn btn-primary btn-sm"
                                                        ng-if="!isMultipleDelete"
                                                        ng-click="confirmBlockUserClick()">Yes</button>
                                                    <button type="button" class="btn btn-light btn-sm"
                                                        data-bs-dismiss="modal">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delete -->
                            <div class="modal fade" id="confirmationModel" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Add New User</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Confirm delete?</h5>
                                                    <button type="button" class="close" data-bs-dismiss="modal"
                                                        aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="font-robo">
                                                        <div class="">
                                                            <div class="card card-1 " style="box-shadow: 'none'">
                                                                <div class="card-body card-thankyou"
                                                                    style="padding: '5px 5px'; text-align: 'center'">
                                                                    <center>
                                                                        <i class="mdi mdi-alert-circle-outline"
                                                                            style="font-size: 6.19rem;color: #f9bd4e;"></i>
                                                                    </center>

                                                                    <div class='message-submitThankyou'>
                                                                        <h5 style="text-align: center;" class="mt-3">Are
                                                                            you sure, you want to delete
                                                                            this user?</h5>
                                                                        <h5 style="text-align: center;"
                                                                            class="mt-3 text-danger">Please note, you
                                                                            cannot
                                                                            recover any data once deleted.</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" ng-if="pleaseWaitBtn == false"
                                                        class="btn btn-primary btn-sm"
                                                        ng-click="yesDeleteConfirmClick()">Yes</button>
                                                    <button ng-if="pleaseWaitBtn == true" type="button"
                                                        class="btn btn-danger btn-sm">
                                                        <i class="fa fa-spinner fa-spin"></i> Please wait...
                                                    </button>
                                                    <button type="button" class="btn btn-light btn-sm"
                                                        data-bs-dismiss="modal">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Table with stripped rows -->
                            <table class="table datatable">
                                <thead>
                                    <tr>
                                        <th><b>Name</b></th>
                                        <th>Email</th>
                                        <th>User Role</th>
                                        <th>User Permission</th>
                                        <th data-type="date" data-format="YYYY/MM/DD">Created Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Sample Data Row -->
                                    <tr ng-repeat="user in usersListArray">
                                        <td>{{user.tl_name}}</td>
                                        <td>{{user.tl_email	}}</td>
                                        <td>{{user.tl_user_type}}</td>
                                        <td>Full Access</td>
                                        <td>{{user.tl_created_at}}</td>
                                        <td>
                                            <button type="button" class="btn btn-success" title="Edit User">
                                                <i class="bi bi-pencil-square" ng-click="editUserClick(user)"></i>
                                            </button>

                                            <button type="button" class="btn btn-danger" title="Delete User"
                                                ng-click="deleteUserClick(user)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                            <button type="button" class="btn btn-warning" title="resend User"
                                                ng-click="resendPasswordClick(user)">
                                                <i class="bi bi-key"></i>
                                            </button>
                                            <button type="button" ng-if="user.tl_user_block_bit == 0"
                                                class="btn btn-warning" title="resend User"
                                                ng-click="blockUserClick(user,'block')">
                                                <i class="bi bi-ban"></i>
                                            </button>
                                            <button type="button" class="btn btn-danger" title="resend User"
                                                ng-if="user.tl_user_block_bit == 1"
                                                ng-click="blockUserClick(user,'Unblock')">
                                                <i class="bi bi-ban"></i>
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </section>

</main><!-- End #main -->