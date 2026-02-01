<main id="main" class="main" ng-controller="AdminOrderServicesCtrl" ng-init="manageOrdersInit()" ng-cloak>
    <div class="pagetitle">
        <h1>Orders</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Orders</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="Odrer-sec">
        <div class="container">
            <div class="row">
                <div class="col-xxl-12 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="order-main d-flex justify-content-between align-items-center">
                                <h5 class="card-title">Manage Order</h5>
                                <button type="button" class="btn btn-primary btn-sm" ng-click="addNewOrderClick()">
                                    <i class="bi bi-plus-circle me-1"></i> Add New Order
                                </button>
                            </div>

                            <!-- Order Table -->
                            <div class="table-responsive">
                                <table class="table table-bordered mt-3">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Name</th>
                                            <th>WhatsApp</th>
                                            <th>Event</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Location</th>
                                            <th>Amount</th>
                                            <th>Paid</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="order in ordersListArray">
                                            <td>{{order.name}}</td>
                                            <td>{{order.whatsapp_no}}</td>
                                            <td>{{order.event_name}}</td>
                                            <td>{{order.photography_type}}</td>
                                            <td>{{order.event_date | date:'dd-MMM-yyyy'}}</td>
                                            <td>{{order.location}}</td>
                                            <td>{{order.amount | currency}}</td>
                                            <td>{{order.amount_paid | currency}}</td>
                                            <td>
                                                <span class="badge" ng-class="{
                    'bg-warning': order.order_status === 'Pending',
                    'bg-primary': order.order_status === 'In Progress',
                    'bg-success': order.order_status === 'Delivered',
                    'bg-danger': order.order_status === 'Cancelled'
                }">
                                                    {{order.order_status}}
                                                </span>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-primary"
                                                    ng-click="editOrderClick(order)">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button type="button" class="btn btn-sm btn-danger ms-1"
                                                    ng-click="deleteOrderClick(order)">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr ng-if="ordersListArray.length === 0">
                                            <td colspan="10" class="text-center">No orders found</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                            <!-- End Order Table -->

                            <!-- Order Modal -->
                            <div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">{{EditOrderId ? 'Edit Order' : 'Add New Order'}}
                                            </h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close" ng-click="modelHideSaveOrderClick()"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form class="row g-3" id="orderForm">
                                                <!-- Client Info -->
                                                <div class="col-md-6">
                                                    <label for="inputName" class="form-label">Name<em>*</em></label>
                                                    <input type="text" class="form-control" id="inputName"
                                                        ng-model="inputName" placeholder="Enter full name" required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputWhatsApp" class="form-label">WhatsApp
                                                        No.<em>*</em></label>
                                                    <input type="text" class="form-control" id="inputWhatsApp"
                                                        ng-model="inputWhatsApp" placeholder="Enter WhatsApp number"
                                                        required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputEmail" class="form-label">Email</label>
                                                    <input type="email" class="form-control" id="inputEmail"
                                                        ng-model="inputEmail" placeholder="Enter email address">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputEventName" class="form-label">Event Name</label>
                                                    <input type="text" class="form-control" id="inputEventName"
                                                        ng-model="inputEventName"
                                                        placeholder="e.g. John & Jane Wedding">
                                                </div>

                                                <!-- Event Details -->
                                                <div class="col-md-6">
                                                    <label for="inputPhotographyType" class="form-label">Photography
                                                        Type<em>*</em></label>
                                                    <select class="form-select" id="inputPhotographyType"
                                                        ng-model="inputPhotographyType" required>
                                                        <option selected disabled value="">Choose type</option>
                                                        <option value="Wedding">Wedding</option>
                                                        <option value="Pre-Wedding">Pre-Wedding</option>
                                                        <option value="Baby Shower">Baby Shower</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-3">
                                                    <label for="inputLocation"
                                                        class="form-label">Location<em>*</em></label>
                                                    <input type="text" class="form-control" id="inputLocation"
                                                        ng-model="inputLocation" placeholder="Enter location" required>
                                                </div>
                                                <div class="col-md-3">
                                                    <label for="inputDate" class="form-label">Date<em>*</em></label>
                                                    <input type="date" class="form-control" id="inputDate"
                                                        ng-model="inputDate" required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputStartTime" class="form-label">Start Time</label>
                                                    <input type="time" class="form-control" id="inputStartTime"
                                                        ng-model="inputStartTime">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputEndTime" class="form-label">End Time</label>
                                                    <input type="time" class="form-control" id="inputEndTime"
                                                        ng-model="inputEndTime">
                                                </div>

                                                <!-- Service Details -->
                                                <div class="col-md-6">
                                                    <label for="inputServiceType"
                                                        class="form-label">Service<em>*</em></label>
                                                    <select class="form-select" id="inputServiceType"
                                                        ng-model="inputServiceType" required>
                                                        <option selected disabled value="">Choose Service</option>
                                                        <option value="Cinematic">Cinematic</option>
                                                        <option value="Candid">Candid</option>
                                                        <option value="Traditional">Traditional</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputAlbumPages" class="form-label">Album
                                                        Pages<em>*</em></label>
                                                    <select class="form-select" id="inputAlbumPages"
                                                        ng-model="inputAlbumPages" required>
                                                        <option selected disabled value="">Choose pages</option>
                                                        <option value="50">50</option>
                                                        <option value="80">80</option>
                                                        <option value="100">100</option>
                                                    </select>
                                                </div>

                                                <!-- Financials -->
                                                <div class="col-md-4">
                                                    <label for="inputAmount" class="form-label">Amount<em>*</em></label>
                                                    <input type="number" class="form-control" id="inputAmount"
                                                        ng-model="inputAmount" required>
                                                </div>
                                                <div class="col-md-4">
                                                    <label for="inputAmountPaid"
                                                        class="form-label">Paid<em>*</em></label>
                                                    <input type="number" class="form-control" id="inputAmountPaid"
                                                        ng-model="inputAmountPaid" required>
                                                </div>
                                                <div class="col-md-4">
                                                    <label for="inputRemainingAmount"
                                                        class="form-label">Remaining<em>*</em></label>
                                                    <input type="number" class="form-control" id="inputRemainingAmount"
                                                        ng-model="inputRemainingAmount" required>
                                                </div>

                                                <!-- Deliverables -->
                                                <div class="col-md-6">
                                                    <label for="inputDeliverables"
                                                        class="form-label">Deliverables</label>
                                                    <input type="text" class="form-control" id="inputDeliverables"
                                                        ng-model="inputDeliverables"
                                                        placeholder="Photos, Album, Video, etc.">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="inputDeliveryDate" class="form-label">Expected Delivery
                                                        Date</label>
                                                    <input type="date" class="form-control" id="inputDeliveryDate"
                                                        ng-model="inputDeliveryDate">
                                                </div>

                                                <!-- Status & Notes -->
                                                <div class="col-md-6">
                                                    <label for="inputOrderStatus" class="form-label">Order
                                                        Status</label>
                                                    <select class="form-select" id="inputOrderStatus"
                                                        ng-model="inputOrderStatus">
                                                        <option selected disabled value="">Select status</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-12">
                                                    <label for="inputNotes" class="form-label">Notes / Special
                                                        Instructions</label>
                                                    <textarea class="form-control" id="inputNotes" rows="2"
                                                        ng-model="inputNotes"
                                                        placeholder="Any special instructions from the client..."></textarea>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                                ng-click="modelHideSaveOrderClick()">Close</button>
                                            <button type="button" class="btn btn-primary"
                                                ng-click="modelSaveOrderClick()" ng-disabled="pleaseWaitBtn">
                                                <span ng-if="!pleaseWaitBtn">Save Order</span>
                                                <span ng-if="pleaseWaitBtn" class="spinner-border spinner-border-sm"
                                                    role="status" aria-hidden="true"></span>
                                                <span ng-if="pleaseWaitBtn"> Saving...</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delete Confirmation Modal -->
                            <div class="modal fade" id="deleteOrderModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Confirm Delete</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Are you sure you want to delete the order for
                                                <strong>{{deleteOrderName}}</strong>?
                                            </p>
                                            <p class="text-danger">This action cannot be undone.</p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-danger" ng-click="confirmDeleteOrder()"
                                                ng-disabled="pleaseWaitBtn">
                                                <span ng-if="!pleaseWaitBtn">Delete</span>
                                                <span ng-if="pleaseWaitBtn" class="spinner-border spinner-border-sm"
                                                    role="status" aria-hidden="true"></span>
                                                <span ng-if="pleaseWaitBtn"> Deleting...</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End Delete Confirmation Modal -->

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>