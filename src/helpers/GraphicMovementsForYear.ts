import moment from "moment";

const GraphicMovementsForYear = (data: any) => {
  let movements = [];
  // Get this moment date
  let month = moment();
  // Counter for how many months we are going to evaluate
  let counter = 12;
  // Parse int the count number in the data array
  data.forEach((element: any) => {
    element.count = parseInt(element.count);
  });
  // Doing this while the coutner has more than 1
  while (counter >= 1) {
    // Get the number of current month
    const tempNumberMonth = month.format("M");
    // Find this month on data
    let monthMovement = data.find(
      (element: any) => element.mes == tempNumberMonth
    );
    // If we dont find it, we set this to zero
    if (!monthMovement) monthMovement = { mes: tempNumberMonth, cout: 0 };
    // Push on movements
    movements.push(monthMovement);
    // Subtract one month
    month = month.subtract(1, "month");
    counter = counter -= 1;
  }
  return movements;
};

export default GraphicMovementsForYear;
