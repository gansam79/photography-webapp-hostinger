<main id="main" class="main">
    <div class="pagetitle">
        <h1>Accessories Management</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active">Accessories</li>
            </ol>
        </nav>
    </div>

    <section class="accessory-sec">
        <div class="container">
            <div class="row mb-3">
                <div class="col-md-6">
                    <input type="text" class="form-control" id="searchAccessory" placeholder="Search Accessories..." onkeyup="filterAccessories()">
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterCategory" onchange="filterAccessories()">
                        <option value="">All Categories</option>
                        <option>Tripod</option>
                        <option>Gimbal</option>
                        <option>Memory Card</option>
                        <option>Lighting Equipment</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="accessory-main d-flex justify-content-between align-items-center">
                                <h5 class="card-title">Manage Accessories</h5>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#accessoryModal" onclick="clearModal()">
                                    <i class="bi bi-plus-circle me-1"></i> Add New Accessory
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered mt-3" id="accessoryTable">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Image</th>
                                            <th>Accessory Name</th>
                                            <th>Brand</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Stock Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Accessories will be added dynamically here -->
                                    </tbody>
                                </table>
                            </div>
                            <div class="modal fade" id="accessoryModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Add New Accessory</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form class="row g-3" id="accessoryForm">
                                                <div class="col-md-6">
                                                    <label class="form-label">Accessory Name</label>
                                                    <input type="text" class="form-control" id="inputAccessoryName" required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Brand</label>
                                                    <input type="text" class="form-control" id="inputBrand" required>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Category</label>
                                                    <select class="form-select" id="inputCategory" required>
                                                        <option selected disabled>Choose category</option>
                                                        <option>Tripod</option>
                                                        <option>Gimbal</option>
                                                        <option>Memory Card</option>
                                                        <option>Lighting Equipment</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="form-label">Price</label>
                                                    <input type="number" class="form-control" id="inputPrice" required>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="form-label">Quantity</label>
                                                    <input type="number" class="form-control" id="inputQuantity" required>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="form-label">Upload Image</label>
                                                    <input type="file" class="form-control" id="inputImage" accept="image/*">
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" onclick="saveAccessory()">Save Accessory</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
    function clearModal() {
        document.getElementById("accessoryForm").reset();
    }

    function saveAccessory() {
        const name = document.getElementById("inputAccessoryName").value;
        const brand = document.getElementById("inputBrand").value;
        const category = document.getElementById("inputCategory").value;
        const price = document.getElementById("inputPrice").value;
        const quantity = document.getElementById("inputQuantity").value;
        const image = document.getElementById("inputImage").files[0];

        if (!name || !brand || !category || !price || !quantity || !image) {
            alert("Please fill in all required fields.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const table = document.getElementById("accessoryTable").getElementsByTagName('tbody')[0];
            const newRow = table.insertRow();
            const stockStatus = quantity > 0 ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-danger">Out of Stock</span>';

            newRow.innerHTML = `
                <td><img src="${e.target.result}" width="50"></td>
                <td>${name}</td>
                <td>${brand}</td>
                <td>${category}</td>
                <td>${price}</td>
                <td>${quantity}</td>
                <td>${stockStatus}</td>
            `;
        };
        reader.readAsDataURL(image);

        document.getElementById("accessoryForm").reset();
        new bootstrap.Modal(document.getElementById("accessoryModal")).hide();
    }

    function filterAccessories() {
        const searchValue = document.getElementById("searchAccessory").value.toLowerCase();
        const categoryFilter = document.getElementById("filterCategory").value;
        const table = document.getElementById("accessoryTable").getElementsByTagName('tbody')[0];
        const rows = table.getElementsByTagName("tr");

        for (let row of rows) {
            const name = row.cells[1].textContent.toLowerCase();
            const category = row.cells[3].textContent;
            row.style.display = (name.includes(searchValue) && (!categoryFilter || category === categoryFilter)) ? "" : "none";
        }
    }
    </script>
</main>
