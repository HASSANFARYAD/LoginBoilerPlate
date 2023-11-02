import React, { useState } from "react";

const UpdatePassword = () => {
  return (
    <>
      <div className="row col-md-8 offset-md-2">
        <div className="card">
          <div className="card-body">
            <form className="form">
              <div className="row">
                <div className="col-md-12">
                  <div class="mb-3">
                    <label class="fw-semibold">Old Password</label>
                    <input type="password" class="form-control" required />
                  </div>
                </div>
                <div className="col-md-12">
                  <div class="mb-3">
                    <label class="fw-semibold">New Password</label>
                    <input type="password" class="form-control" required />
                  </div>
                </div>

                <div className="col-md-12">
                  <div class="mb-3">
                    <label class="fw-semibold">Confirm Password</label>
                    <input type="password" class="form-control" required />
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button class="btn btn-danger me-md-2">Update Profile</button>
                <button class="btn btn-primary" type="submit">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;