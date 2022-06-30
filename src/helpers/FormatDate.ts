import e from "express";

const FormatDateForMovements = (arrayMovements: any) => {
  return arrayMovements.map((element: any) => {
    const movement_date =  element.movement_date.toISOString().slice(0, 10);
    return {
      ...element,
      movement_date
    }
  });
};

export default FormatDateForMovements;
