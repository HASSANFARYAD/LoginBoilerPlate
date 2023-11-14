import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileAction,
  userProfileAction,
  updateProfileImage,
} from "../../../redux/authSlice";
import Loader from "../../Loader/Loader";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.auth?.userAuth);
  const [responseData, setResponseData] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image && image.size <= 2 * 1024 * 1024) {
      setSelectedImage(image);
      setIsUpdateDisabled(false);
    } else {
      toast.warning("Image must be less than 2 MB.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      e.target.value = null; // Clear the file input
    }
  };

  const handleDeleteAndUpdateImage = async (action) => {
    setIsUpdateDisabled(true);
    setIsDeleteDisabled(true);
    setIsUploading(true);
    const formData = {
      UserId: loggedInUser.id,
      file: selectedImage,
    };

    if (action === "deleted") {
      formData.isDeleted = true;
    }
    try {
      const response = await dispatch(updateProfileImage(formData));

      if (updateProfileImage.fulfilled.match(response)) {
        toast.success(response.payload.message);
        setIsUpdateDisabled(false);
        setIsDeleteDisabled(false);
        setIsUploading(false);
      } else {
        toast.error(response.payload.message);
        setIsUpdateDisabled(false);
        setIsDeleteDisabled(false);
        setIsUploading(false);
      }
    } catch (error) {
      // Handle request error
      toast.error("Failed to update image");
      setIsUpdateDisabled(false);
      setIsDeleteDisabled(false);
      setIsUploading(false);
    }
  };

  const handleDeleteImage = () => {
    handleDeleteAndUpdateImage("deleted");
  };

  const handleUpdateImage = () => {
    handleDeleteAndUpdateImage("udpated");
  };

  const handleDispatch = async (action) => {
    try {
      const resultAction = await dispatch(action);
      const response = resultAction.payload;
      setResponseData(response);
      formik.setValues({
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        country: response.country || "",
        state: response.state || "",
        city: response.city || "",
        zipCode: response.zipCode || "",
        timezone: response.timezone || "",
        gender: response.gender || "",
        description: response.description || "",
        profile: response.profilePicture || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedInUser.id) {
      handleDispatch(userProfileAction(loggedInUser.id));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      timezone: "",
      gender: "",
      description: "",
      profile: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      zipCode: Yup.string().required("Zipcode is required"),
      timezone: Yup.string().required("Timezone is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        const action = dispatch(updateProfileAction(values));
        const resultAction = await action;
        setMessage(resultAction?.payload?.message);
      } catch (error) {}
    },
  });

  return (
    <>
      {responseData === null ? (
        <Loader />
      ) : (
        <>
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Update Profile</h1>
          </div>
          <div className="container row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <form className="form">
                    <div className="mb-3">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          className="card-img-top rounded-circle"
                          alt="Selected"
                        />
                      ) : (
                        <img
                          src={formik.values.profile}
                          className="card-img-top rounded-circle"
                          alt="Selected"
                        />
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="fw-semibold">Profile Image</label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        className="btn btn-sm btn-danger me-md-2"
                        onClick={handleDeleteImage}
                        disabled={isDeleteDisabled || isUploading}
                      >
                        Delete Image
                      </button>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={handleUpdateImage}
                        disabled={
                          isUpdateDisabled || isUploading || !selectedImage
                        }
                      >
                        Update Image
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="card">
                <div className="card-body">
                  <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formik.values.firstName}
                            onChange={formik.handleChange("firstName")}
                            onBlur={formik.handleBlur("firstName")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formik.values.lastName}
                            onChange={formik.handleChange("lastName")}
                            onBlur={formik.handleBlur("lastName")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={responseData.userName}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={responseData.email}
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">Select Country</label>
                          <select
                            name="country"
                            className="form-select"
                            value={formik.values.country}
                            onChange={formik.handleChange("country")}
                          >
                            <option value="">Select Country</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Åland Islands">Åland Islands</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="American Samoa">
                              American Samoa
                            </option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Anguilla">Anguilla</option>
                            <option value="Antarctica">Antarctica</option>
                            <option value="Antigua and Barbuda">
                              Antigua and Barbuda
                            </option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Aruba">Aruba</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bermuda">Bermuda</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">
                              Bosnia and Herzegovina
                            </option>
                            <option value="Botswana">Botswana</option>
                            <option value="Bouvet Island">Bouvet Island</option>
                            <option value="Brazil">Brazil</option>
                            <option value="British Indian Ocean Territory">
                              British Indian Ocean Territory
                            </option>
                            <option value="Brunei Darussalam">
                              Brunei Darussalam
                            </option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Cayman Islands">
                              Cayman Islands
                            </option>
                            <option value="Central African Republic">
                              Central African Republic
                            </option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Christmas Island">
                              Christmas Island
                            </option>
                            <option value="Cocos (Keeling) Islands">
                              Cocos (Keeling) Islands
                            </option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo, The Democratic Republic of The">
                              Congo, The Democratic Republic of The
                            </option>
                            <option value="Cook Islands">Cook Islands</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Cote D'ivoire">Cote D'ivoire</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">
                              Czech Republic
                            </option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">
                              Dominican Republic
                            </option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">
                              Equatorial Guinea
                            </option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Falkland Islands (Malvinas)">
                              Falkland Islands (Malvinas)
                            </option>
                            <option value="Faroe Islands">Faroe Islands</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="French Guiana">French Guiana</option>
                            <option value="French Polynesia">
                              French Polynesia
                            </option>
                            <option value="French Southern Territories">
                              French Southern Territories
                            </option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Gibraltar">Gibraltar</option>
                            <option value="Greece">Greece</option>
                            <option value="Greenland">Greenland</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guadeloupe">Guadeloupe</option>
                            <option value="Guam">Guam</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guernsey">Guernsey</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-bissau">Guinea-bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Heard Island and Mcdonald Islands">
                              Heard Island and Mcdonald Islands
                            </option>
                            <option value="Holy See (Vatican City State)">
                              Holy See (Vatican City State)
                            </option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran, Islamic Republic of">
                              Iran, Islamic Republic of
                            </option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Isle of Man">Isle of Man</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jersey">Jersey</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Korea, Democratic People's Republic of">
                              Korea, Democratic People's Republic of
                            </option>
                            <option value="Korea, Republic of">
                              Korea, Republic of
                            </option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Lao People's Democratic Republic">
                              Lao People's Democratic Republic
                            </option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libyan Arab Jamahiriya">
                              Libyan Arab Jamahiriya
                            </option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macao">Macao</option>
                            <option value="Macedonia, The Former Yugoslav Republic of">
                              Macedonia, The Former Yugoslav Republic of
                            </option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">
                              Marshall Islands
                            </option>
                            <option value="Martinique">Martinique</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mayotte">Mayotte</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia, Federated States of">
                              Micronesia, Federated States of
                            </option>
                            <option value="Moldova, Republic of">
                              Moldova, Republic of
                            </option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Netherlands Antilles">
                              Netherlands Antilles
                            </option>
                            <option value="New Caledonia">New Caledonia</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Niue">Niue</option>
                            <option value="Norfolk Island">
                              Norfolk Island
                            </option>
                            <option value="Northern Mariana Islands">
                              Northern Mariana Islands
                            </option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Palestinian Territory, Occupied">
                              Palestinian Territory, Occupied
                            </option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">
                              Papua New Guinea
                            </option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Pitcairn">Pitcairn</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Reunion">Reunion</option>
                            <option value="Romania">Romania</option>
                            <option value="Russian Federation">
                              Russian Federation
                            </option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Helena">Saint Helena</option>
                            <option value="Saint Kitts and Nevis">
                              Saint Kitts and Nevis
                            </option>
                            <option value="Saint Lucia">Saint Lucia</option>
                            <option value="Saint Pierre and Miquelon">
                              Saint Pierre and Miquelon
                            </option>
                            <option value="Saint Vincent and The Grenadines">
                              Saint Vincent and The Grenadines
                            </option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">
                              Sao Tome and Principe
                            </option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">
                              Solomon Islands
                            </option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Georgia and The South Sandwich Islands">
                              South Georgia and The South Sandwich Islands
                            </option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Svalbard and Jan Mayen">
                              Svalbard and Jan Mayen
                            </option>
                            <option value="Swaziland">Swaziland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syrian Arab Republic">
                              Syrian Arab Republic
                            </option>
                            <option value="Taiwan">Taiwan</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania, United Republic of">
                              Tanzania, United Republic of
                            </option>
                            <option value="Thailand">Thailand</option>
                            <option value="Timor-leste">Timor-leste</option>
                            <option value="Togo">Togo</option>
                            <option value="Tokelau">Tokelau</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">
                              Trinidad and Tobago
                            </option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Turks and Caicos Islands">
                              Turks and Caicos Islands
                            </option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">
                              United Arab Emirates
                            </option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="United States">United States</option>
                            <option value="United States Minor Outlying Islands">
                              United States Minor Outlying Islands
                            </option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Viet Nam">Viet Nam</option>
                            <option value="Virgin Islands, British">
                              Virgin Islands, British
                            </option>
                            <option value="Virgin Islands, U.S.">
                              Virgin Islands, U.S.
                            </option>
                            <option value="Wallis and Futuna">
                              Wallis and Futuna
                            </option>
                            <option value="Western Sahara">
                              Western Sahara
                            </option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formik.values.state}
                            onChange={formik.handleChange("state")}
                            onBlur={formik.handleBlur("state")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formik.values.city}
                            onChange={formik.handleChange("city")}
                            onBlur={formik.handleBlur("city")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="fw-semibold">Zip code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formik.values.zipCode}
                            onChange={formik.handleChange("zipCode")}
                            onBlur={formik.handleBlur("zipCode")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="fw-semibold p">Gender</label>
                          </div>
                          <div className="col-md-9">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="Male"
                                value="Male"
                                checked={formik.values.gender === "Male"}
                                onChange={formik.handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Male"
                              >
                                Male
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                id="Female"
                                value="Female"
                                checked={formik.values.gender === "Female"}
                                onChange={formik.handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Female"
                              >
                                Female
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="fw-semibold">About </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={formik.values.description}
                            onChange={formik.handleChange("description")}
                            onBlur={formik.handleBlur("description")}
                          ></textarea>
                        </div>

                        {/* <div className="mb-3">
                      <label className="fw-semibold">Time Zone</label>
                      <select
                        name="timezone_offset"
                        id="timezone-offset"
                        className="form-select"
                        value={formik.values.timezone}
                        onChange={formik.handleChange("timezone")}
                      >
                        <option value="-12:00">
                          (GMT -12:00) Eniwetok, Kwajalein
                        </option>
                        <option value="-11:00">
                          (GMT -11:00) Midway Island, Samoa
                        </option>
                        <option value="-10:00">(GMT -10:00) Hawaii</option>
                        <option value="-09:50">(GMT -9:30) Taiohae</option>
                        <option value="-09:00">(GMT -9:00) Alaska</option>
                        <option value="-08:00">
                          (GMT -8:00) Pacific Time (US &amp; Canada)
                        </option>
                        <option value="-07:00">
                          (GMT -7:00) Mountain Time (US &amp; Canada)
                        </option>
                        <option value="-06:00">
                          (GMT -6:00) Central Time (US &amp; Canada), Mexico
                          City
                        </option>
                        <option value="-05:00">
                          (GMT -5:00) Eastern Time (US &amp; Canada), Bogota,
                          Lima
                        </option>
                        <option value="-04:50">(GMT -4:30) Caracas</option>
                        <option value="-04:00">
                          (GMT -4:00) Atlantic Time (Canada), Caracas, La Paz
                        </option>
                        <option value="-03:50">(GMT -3:30) Newfoundland</option>
                        <option value="-03:00">
                          (GMT -3:00) Brazil, Buenos Aires, Georgetown
                        </option>
                        <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                        <option value="-01:00">
                          (GMT -1:00) Azores, Cape Verde Islands
                        </option>
                        <option value="+00:00" selected="selected">
                          (GMT) Western Europe Time, London, Lisbon, Casablanca
                        </option>
                        <option value="+01:00">
                          (GMT +1:00) Brussels, Copenhagen, Madrid, Paris
                        </option>
                        <option value="+02:00">
                          (GMT +2:00) Kaliningrad, South Africa
                        </option>
                        <option value="+03:00">
                          (GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg
                        </option>
                        <option value="+03:50">(GMT +3:30) Tehran</option>
                        <option value="+04:00">
                          (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi
                        </option>
                        <option value="+04:50">(GMT +4:30) Kabul</option>
                        <option value="+05:00">
                          (GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent
                        </option>
                        <option value="+05:50">
                          (GMT +5:30) Bombay, Calcutta, Madras, New Delhi
                        </option>
                        <option value="+05:75">
                          (GMT +5:45) Kathmandu, Pokhara
                        </option>
                        <option value="+06:00">
                          (GMT +6:00) Almaty, Dhaka, Colombo
                        </option>
                        <option value="+06:50">
                          (GMT +6:30) Yangon, Mandalay
                        </option>
                        <option value="+07:00">
                          (GMT +7:00) Bangkok, Hanoi, Jakarta
                        </option>
                        <option value="+08:00">
                          (GMT +8:00) Beijing, Perth, Singapore, Hong Kong
                        </option>
                        <option value="+08:75">(GMT +8:45) Eucla</option>
                        <option value="+09:00">
                          (GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk
                        </option>
                        <option value="+09:50">
                          (GMT +9:30) Adelaide, Darwin
                        </option>
                        <option value="+10:00">
                          (GMT +10:00) Eastern Australia, Guam, Vladivostok
                        </option>
                        <option value="+10:50">
                          (GMT +10:30) Lord Howe Island
                        </option>
                        <option value="+11:00">
                          (GMT +11:00) Magadan, Solomon Islands, New Caledonia
                        </option>
                        <option value="+11:50">
                          (GMT +11:30) Norfolk Island
                        </option>
                        <option value="+12:00">
                          (GMT +12:00) Auckland, Wellington, Fiji, Kamchatka
                        </option>
                        <option value="+12:75">
                          (GMT +12:45) Chatham Islands
                        </option>
                        <option value="+13:00">
                          (GMT +13:00) Apia, Nukualofa
                        </option>
                        <option value="+14:00">
                          (GMT +14:00) Line Islands, Tokelau
                        </option>
                      </select>
                    </div> */}
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <NavLink
                        className="btn btn-danger me-md-2"
                        to="/update-password"
                      >
                        Change Password
                      </NavLink>
                      <button className="btn btn-primary" type="submit">
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
