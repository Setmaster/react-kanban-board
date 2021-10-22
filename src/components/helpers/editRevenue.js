const EditRevenue = async (id, revenue_amount, driverId) => {

    if(driverId !== 1){
        console.log("NOT EDITABLE");
        return;
    }

    try {
        const body = { revenue_amount };

        const response = await fetch(`http://localhost:5000/revenue/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        console.log("Editing Revenuee")
    } catch (error) {
        console.log(error);
    }
};

export default EditRevenue