import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";


const itemsFromBackend = [
  {id: uuid(), description: "First task"},
  {id: uuid(), description: "Second task"},
  {id: uuid(), description: "Third task"},
  {id: uuid(), description: "Fourth task"},
];

let unassignedOrders = [  
  {id: 9999999, description: "Test"},
];

const columnsFromBackend = {
  [uuid()]: {
      name: 'To do',
      items: itemsFromBackend
  },
  ["orders"]: {
      name: 'In Progress',
      items: unassignedOrders
  },
  [uuid()]: {
      name: 'Done',
      items: []
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;

  const { source, destination } = result;

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
              items: sourceItems
          },
          [destination.droppableId]: {
              ...destColumn,
              items: destItems
          }
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
              items: copiedItems
          }
      });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getDriver = async () => {
    try {
      const response = await fetch("http://localhost:5000");
      const jsonData = await response.json();

      setDrivers(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      const jsonData = await response.json();

      setOrders(jsonData);
      
      // console.log(await getOrder());
    } catch (error) {
      console.log(error.message);
    }
  };
  // getOrder().then(console.log('stuff'));
  useEffect(() => {
      if(drivers.length === 0) {
          getDriver();
      }
      if(!loaded) {
          console.log("ORDERER");
          getOrder().then(() => {
              setColumns({
                  ...columns,
                  ["orders"]: {
                      name: 'In Progress',
                      items: orders
                  },
                  ["xuxu"]:{
                      name: 'xuxu',
                      items: []
                  },
              }
              );
              setLoaded(true);
          })
      }
          // if(columns["orders"].items.length !== orders.length){
          //     setColumns({
          //         ...columns,
          //         ["orders"]: {
          //             name: 'In Progress',
          //             items: orders
          //         }
          //     })
          // }
          console.log("ORDERER: ", orders);
          console.log("Columns: ", columns);
      }, [orders, drivers, columns, setColumns, loaded, setLoaded]);

    // console.log("ORDERS: ", orders);
    // console.log("DRIVERS: ", drivers);
  const checkOrders = (unorder) =>{
    return unorder.assigned === false;
  }
 

    // unassignedOrders = orders.filter(checkOrders);
  
  
  



//   console.log("drivers: ", drivers);
//    console.log("orders: ", columns);


// console.log("newArr: ", unassignedOrders);






  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
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
              <div style={{ margin: 8 }}>
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
                                    {item.description}
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
