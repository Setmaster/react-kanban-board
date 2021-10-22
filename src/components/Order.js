import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";

const Order = (props) => {
    const item = props.item;
    const index = props.index;
    const editCost = props.editCost;
    const editRevenue = props.editRevenue;

    const [state, setState] = useState(
        {
            cost: item.cost,
            newCost: item.cost,
            revenue: item.revenue_amount,
            newRevenue: item.revenue_amount,
            editable: false,
            buttonText: "Edit",
        });

    return (
        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
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
                            backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                            color: "white",
                            ...provided.draggableProps.style,
                        }}
                    >
                        <h3>Description: {item.description}</h3>

                        <table className="table-cont">
                            <thead>
                            <tr>
                                <label>Cost: ${state.cost}</label>
                            </tr>
                            <tr>
                                <input
                                    type="text"
                                    className="edit-control"
                                    value={state.newCost}

                                    onChange={(d) => {
                                        setState(prevState => {
                                            return(
                                                {...prevState, newCost:d.target.value}
                                            )
                                        })
                                    }}
                                />

                                <th>
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            if (item.driver_id !== 1) {
                                                return;
                                            }
                                            if (state.editable) {

                                                editCost(item.id, state.newCost, item.driver_id);
                                                editRevenue(item.id, state.newRevenue, item.driver_id);
                                            setState(prevState => {
                                                return(
                                                    {...prevState, cost: state.newCost, revenue: state.newRevenue, editable: false, buttonText: "Edit"}
                                                )
                                            })
                                            }else{
                                                setState(prevState => {
                                                    return(
                                                        {...prevState, editable: true, buttonText: "Save"}
                                                    )
                                                })
                                            }

                                        }}
                                    >
                                        {state.buttonText}
                                    </button>
                                </th>

                            </tr>
                                <thead>
                                    <tr>
                                        <label>Revenue: ${state.revenue}</label>
                                    </tr>
                                    {/*Revenue: ${" "}*/}
                                    <input
                                        type="text"
                                        className="edit-control"
                                        value={state.newRevenue}
                                        onChange={(d) => {
                                            setState(prevState => {
                                                return(
                                                    {...prevState, newRevenue:d.target.value}
                                                )
                                            })
                                        }}
                                    />
                                </thead>
                                <th
                                    style={{
                                        padding: "0.5rem",
                                        textAlign: "",
                                    }}
                                >

                                </th>

                            </thead>
                        </table>
                    </div>
                );
            }}
        </Draggable>
    );
};

export default Order;