const checkWinner = (id, playground) => {
  const localData = localStorage.getItem(id);
  if (!localData) return false;

  const data = JSON.parse(localData);
  if (data.symbol === playground.wonby) {
    return "You";
  }

  const people = JSON.parse(playground.people);


  return playground.wonby === "X" ? people[0] : people[1]
}

export default checkWinner;