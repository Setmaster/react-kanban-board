import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {v4 as uuid} from "uuid";
import Order from "./components/Order";
import EditCost from "./components/helpers/editCost";
import EditRevenue from "./components/helpers/editRevenue";
import UpdateDriverOrder from "./components/helpers/updateDriverOrder";

function App() {
    const [columns, setColumns] = useState({});
    const [drivers, setDrivers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [refresh, setRefresh] = useState(false);


    const onDragEnd = async (result) => {
        console.log("EAR CIL", columns);
        if (!result.destination) return;

        const {source, destination} = result;
        console.log("CIL source dest", source, destination);
        if (source.droppableId !== destination.droppableId) {
            console.log("COLUMNS: ", columns, "result: ", result);
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            UpdateDriverOrder(result.draggableId, destination.droppableId).then(()=> {
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

                console.log("CIL", columns);
                 setLoaded(false);
            })
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
        //  Conditional logic for drivers and orders list on page load
        if (!loaded) {
            console.log("NOT LOADED");
            Promise.all([getDriver(), getOrder()]).then((values) => {
                console.log("Drivers and orders:",drivers, orders);

                let newColumns = {
                    ...columns
                };

                // Iterating over list of stored drivers
                for (const driver of drivers) {
                    // Filtering orders based on assignment to individual drivers
                    let driverOrders = orders.filter((dOrder) => {
                        // console.log("Order", dOrder.description, "belongs to", driver.id);
                        return dOrder.driver_id === driver.id;
                    });
                    newColumns = {
                        ...newColumns,
                        [driver.id]: {
                            name: driver.drivername,
                            items: driverOrders,
                        },
                    };
                }
                setColumns({...newColumns});
                setLoaded(true);
            });
        }

        //  Setting dependencies for useEffect
    }, [orders, drivers, columns, setColumns, loaded, setLoaded]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                border: "7px solid pink",
            }}
        >
            <DragDropContext
                onDragEnd={
                     (result) => {
                         console.log("Result:",result);
                        onDragEnd(result);
                    }}
            >
                {Object.entries(columns).map(([id, column]) => {
                    return (
                        <div
                            className="main-container"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                border: "3px solid yellow",
                            }}
                        >
                            <h2>{column.name}</h2>
                            <div
                                className="column-outer-container"
                                style={{margin: 8, border: "7px dotted teal"}}
                            >
                                <Droppable droppableId={id} key={id}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                className="column-container"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver
                                                        ? "lightblue"
                                                        : "lightgrey",
                                                    padding: 4,
                                                    width: 250,
                                                    minHeight: 500,
                                                    border: "5px solid black",
                                                }}
                                            >
                                                {/* {console.log("columnnnnnnn", column.items)} */}
                                                {column.items.map((item, index) => {
                                                    //  console.log('ITEM:', item);
                                                    return (
                                                        <Order
                                                            key={item.id}
                                                            item={item}
                                                            index={index}
                                                            editCost={EditCost}
                                                            editRevenue={EditRevenue}
                                                        />
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