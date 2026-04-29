import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllAdministrator } from "../../actions/AdministratorAction";

const AdministratorList = () => {
  const dispatch = useDispatch();
  const { administrators, isLoading, error } = useSelector(
    (state) => state.administrator,
  );

  useEffect(() => {
    dispatch(GetAllAdministrator());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Administrators</h2>

      {isLoading && <p>Hang tight, we’re loading administrators.</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && administrators && administrators.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {administrators.map((admin, index) => (
            <div key={index} className="bg-white p-4 shadow rounded border">
              <h3 className="text-lg font-semibold">
                {admin.name || admin.FirstName || "Administrator"}
              </h3>
              <p className="text-gray-600">
                {admin.email || admin.EmailAddress || "No Email Provided"}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading &&
        !error &&
        (!administrators || administrators.length === 0) && (
          <p>No administrators found.</p>
        )}
    </div>
  );
};

export default AdministratorList;
