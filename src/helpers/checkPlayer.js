const checkIfPlayer = (id) => {
  const localData = localStorage.getItem(id);
  if (!localData) return false;

  return JSON.parse(localData);
}

export default checkIfPlayer;