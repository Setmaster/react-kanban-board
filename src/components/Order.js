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
    const [editable, setEditable] = useState(false);

    let displayCost = cost;


    if(!editable && item.cost !== newCost){
        setNewCost(item.cost);
    }
    if(editable){
        console.log("Is editable");
        displayCost = newCost;
    }

    console.log("RENDERED ", item.description);
    // if(cost !== item.cost){
    //     setCost(item.cost);
    // }
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
                                            if(editable){
                                                console.log("Saved cost to db", "New cost is: ", newCost);
                                                 editCost(item.id, newCost, item.driver_id);
                                                 setCost(newCost);
                                            }
                                        editable ? setEditable(false) : setEditable(true);
                                    }}>Edit
                                    </button>
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Revenue: $ <input
                                    type="text"
                                    className="edit-control"
                                    value={revenue}
                                    onChange={f => {
                                    //    setRevenue(f.target.value)
                                    }}
                                />
                                </th>
                                <th
                                    style={{
                                        padding: "0.5rem",
                                        textAlign: "",
                                    }}
                                >
                                    <button onClick={(e) => {
                                        editRevenue(item.id, revenue)
                                    }}>Edit</button>
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