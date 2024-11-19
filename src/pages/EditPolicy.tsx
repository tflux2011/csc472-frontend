import { useEffect, useState } from "react";
import { usePolicy, Policy } from "../contexts/PolicyContext";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { updatePolicy } from "../services/api";
import { useParams } from "react-router-dom";
import { PolicyFormValues } from "../utils/types";
import DashboardHeader from "../components/DashboardHeader";



const EditPolicy = () => {
  const { fetchPolicy } = usePolicy();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const loadPolicy = async () => {
      if (id) {
        const fetchedPolicy = await fetchPolicy(id);
        setPolicy(fetchedPolicy);
      }
    };
    loadPolicy();
  }, [fetchPolicy, id]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters long"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters long"),
    category: Yup.string().required("Please select a category"),
  });

  const initialValues: PolicyFormValues = {
    title: policy?.title || "",
    description: policy?.description || "",
    category: policy?.category || "",
  };

  const handleSubmit = async (
    values: PolicyFormValues,
    { setSubmitting }: FormikHelpers<PolicyFormValues>
  ) => {
    try {
      setSuccessMessage("");
      const res = await updatePolicy(values, id as string);
      if (res.success) {
        setSuccessMessage("🎉 Hurray! Policy was updated successfully!");
        // resetForm();
      } else {
        setSuccessMessage("Oops! Failed to update policy. Please try again.");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      setSuccessMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex-1 sm:ml-64">
        <DashboardHeader />
        <div className="p-4">
          <Formik
            enableReinitialize // Ensures the form reinitializes when `policy` changes
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold text-gray-900">
                      {id ? "Edit Policy" : "New Policy"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      This information will be displayed publicly, so be careful
                      what you share.
                    </p>
                    {successMessage && (
                      <div className="mt-4 text-green-600 text-sm font-semibold bg-white rounded p-2">
                        {successMessage}
                      </div>
                    )}

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                          Title
                        </label>
                        <div className="mt-2">
                          <Field
                            type="text"
                            name="title"
                            id="title"
                            className="input-text"
                            placeholder="Enter title of policy"
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="col-span-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Description
                        </label>
                        <div className="mt-2">
                          <Field
                            as="textarea"
                            name="description"
                            id="description"
                            rows="10"
                            className="input-text"
                            placeholder="Enter description of policy"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          Write a few sentences about this policy.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Category
                        </label>
                        <div className="mt-2">
                          <Field
                            as="select"
                            name="category"
                            id="category"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm"
                          >
                            <option value="">Select a Category</option>
                            <option value="General">General</option>
                            <option value="Library">Library</option>
                            <option value="Meditation">Meditation</option>
                            <option value="Education">Education</option>
                            <option value="Visa & Travel">Visa & Travel</option>
                            <option value="Students Lounge">
                              Students Lounge
                            </option>
                            <option value="Food">Food</option>
                          </Field>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                    
                <div className="mt-6 flex items-center justify-end gap-x-6">
                {successMessage && (
                      <span className="text-green-600 text-sm font-semibold rounded p-2">
                        {successMessage}
                      </span>
                    )}
                  <button
                    type="button"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-sr-sm-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditPolicy;