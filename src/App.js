import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {v4 as uuid} from "uuid";


const columnsFromBackend = {
    ["orders"]: {
        name: "Unassigned Orders",
        items: [],
    },
};

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const {source, destination} = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems,
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems,
            },
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems,
            },
        });
    }
};

function App() {
    const [columns, setColumns] = useState(columnsFromBackend);
    const [drivers, setDrivers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);


    // Func to fetch data for drivers from db
    const getDriver = async () => {
        try {
            const response = await fetch("http://localhost:5000");
            const jsonData = await response.json();

            setDrivers(jsonData);
        } catch (error) {
            console.log(error.message);
        }
    };

    // Func to fetch data for orders from db
    const getOrder = async () => {
        try {
            const response = await fetch("http://localhost:5000/orders");
            const jsonData = await response.json();

            setOrders(jsonData);


        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {

        //  Conditional logic for drivers and orders list
        if (!loaded) {
            Promise.all([getDriver(), getOrder()]).then((values) => {

                let unassignedOrders = orders.filter((uOrder)=>{
                    return uOrder.assigned === false;

                });

                console.log("uasssssssss: ", unassignedOrders);

                let newColumns = {
                    ...columns,
                    ["orders"]: {
                        name: "Unassigned Orders",
                        items: unassignedOrders,
                    },
                };
                for (const driver of drivers) {

                    let driverOrders = orders.filter((dOrder)=>{
                        return dOrder.driver_id === driver.id;
                    })
                    newColumns = {
                        ...newColumns,
                        [driver.id]: {
                            name: driver.drivername,
                            items: driverOrders,
                        },
                    };
                }
                setColumns({ ...newColumns });
                setLoaded(true);
            });
        }

        //  Setting dependencies for useEffect
    }, [orders, drivers, columns, setColumns, loaded, setLoaded]);

    const checkOrders = (unorder) => {
        return unorder.assigned === false;
    };

    // unassignedOrders = orders.filter(checkOrders);

    //   console.log("drivers: ", drivers);
    //   console.log("orders: ", orders);

    // console.log("newArr: ", unassignedOrders);

    return (
        <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
                {Object.entries(columns).map(([id, column]) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <h2>{column.name}</h2>
                            <div style={{margin: 8}}>
                                <Droppable droppableId={id} key={id}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver
                                                        ? "lightblue"
                                                        : "lightgrey",
                                                    padding: 4,
                                                    width: 250,
                                                    minHeight: 500,
                                                }}
                                            >
                                                {/* {console.log("columnnnnnnn", column.items)} */}
                                                {column.items.map((item, index) => {
                                                    // console.log('ITEM:', item);
                                                    return (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={item.id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: "none",
                                                                            padding: 16,
                                                                            margin: "0 0 8px 0",
                                                                            minHeight: "50px",
                                                                            backgroundColor: snapshot.isDragging
                                                                                ? "#263B4A"
                                                                                : "#456C86",
                                                                            color: "white",
                                                                            ...provided.draggableProps.style,
                                                                        }}
                                                                    >
                                                                        <h3>Description: {item.description}</h3>
                                                                        <h3>Cost: ${item.cost}</h3>
                                                                        <h3>Revenue: ${item.revenue_amount}</h3>
                                                                        <h4>Driver: {item.drivername}</h4>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
}

export default App;