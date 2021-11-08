const copyLink = async (playgroundParams) => {
  const link = `http://localhost:3001?playground=${playgroundParams}`
  console.log(link);
  await navigator.clipboard.writeText(link);
  alert(`You have copied : ${link}`);
}

export default copyLink;