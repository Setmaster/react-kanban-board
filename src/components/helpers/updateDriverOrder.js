// Update driver id
const UpdateDriverOrder = async (id, driver_id) => {
    try {
        const body = { driver_id };
        const response = await fetch(`http://localhost:5000/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });



    } catch (error) {
        console.log(error.message);
    }
};

export default UpdateDriverOrder;