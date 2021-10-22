import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";

const Order = (props) => {
    const item = props.item;
    const index = props.index;
    const editCost = props.editCost;
    const editRevenue = props.editRevenue;

    const [cost, setCost] = useState(item.cost)
    const [newCost, setNewCost] = useState(item.cost)
    const [revenue, setRevenue] = useState(item.revenue_amount)
    const [newRevenue, setNewRevenue] = useState(item.revenue_amount)
    const [editable, setEditable] = useState(false);
    const [buttonMode, setButtonMode] = useState("Edit");
    let displayCost = item.cost;
    let displayRevenue = item.revenue_amount;

    console.log("Driver id of",item.description, "is",item.driver_id);
    // let buttonMode = "Edit";
    // if(editable){
    //     buttonMode = "Save";
    // }

    // if(!editable && item.cost !== newCost && item.revenue_amount !== newRevenue){
    //     setNewCost(item.cost);
    //     setNewRevenue(item.revenue_amount);
    // }else if(!editable && item.cost !== newCost){
    //     setNewCost(item.cost);
    // }else if(!editable && item.revenue_amount !== newRevenue){
    //     setNewRevenue(item.revenue_amount);
    // }
    if (editable) {
        console.log("Is editable");
        displayCost = newCost;
        displayRevenue = newRevenue;
    }

    console.log("RENDERED ", item.description);

    return (
        <Draggable
            key={item.id}
            draggableId={item.id.toString()}
            index={index}
        >
            {(provided, snapshot) => {
                return (
                    <div
                        className="order-container"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            userSelect: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            minHeight: "50px",
                            border: "5px solid red",
                            backgroundColor: snapshot.isDragging
                                ? "#263B4A"
                                : "#456C86",
                            color: "white",
                            ...provided.draggableProps.style,
                        }}
                    >
                        <h3>Description: {item.description}</h3>

                        <table className="table-cont">
                            <thead>
                            <tr>
                                <h3>Cost: $
                                    <input
                                        type="text"
                                        className="edit-control"
                                        value={displayCost}
                                        onChange={d => {
                                            setNewCost(d.target.value);
                                        }}
                                    />
                                </h3>
                                <th>
                                    <button onClick={(e) => {
                                        if (item.driver_id !== 1) {
                                            console.log("NOT UNASSIGNED")
                                            return;
                                        }

                                        if (editable) {

                                            setCost(newCost);
                                            setRevenue(newRevenue);
                                            Promise.all([editCost(item.id, newCost, item.driver_id), editRevenue(item.id, newRevenue, item.driver_id)]).then(() => {
                                                console.log("Saved cost and revenue to db");
                                                props.onOrderCreated();
                                                setEditable(false);
                                                setButtonMode("Edit");
                                            })

                                        }else{
                                            setEditable(true);
                                            setButtonMode("Save");
                                        }


                                    }}>{buttonMode}
                                    </button>
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Revenue: $ <input
                                    type="text"
                                    className="edit-control"
                                    value={displayRevenue}
                                    onChange={d => {
                                        setNewRevenue(d.target.value);
                                    }
                                    }
                                />
                                </th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                );
            }}
        </Draggable>);
}

export default Order;