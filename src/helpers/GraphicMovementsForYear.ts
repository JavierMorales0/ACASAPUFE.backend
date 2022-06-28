import moment from "moment";

const GraphicMovementsForYear = (data: any) => {
  let labels = [];
  let values = [];
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
    if (!monthMovement) monthMovement = { mes: tempNumberMonth, count: 0 };
    // Push on movements
    labels.push(getMonthName(monthMovement.mes));
    values.push(monthMovement.count);
    // Subtract one month
    month = month.subtract(1, "month");
    counter = counter -= 1;
  }
  return {
    labels,
    values,
  };
};

const getMonthName = (monthNumber: number) => {
  const monthsName = [
    { number: 1, name: "Ene" },
    { number: 2, name: "Feb" },
    { number: 3, name: "Mar" },
    { number: 4, name: "Abr" },
    { number: 5, name: "May" },
    { number: 6, name: "Jun" },
    { number: 7, name: "Jul" },
    { number: 8, name: "Ago" },
    { number: 9, name: "Sep" },
    { number: 10, name: "Oct" },
    { number: 11, name: "Nov" },
    { number: 12, name: "Dic" },
  ];
  const monthSelected = monthsName.find(
    (element: any) => element.number == monthNumber
  );
  return monthSelected?.name;
};
export default GraphicMovementsForYear;
