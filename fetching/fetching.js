const getRankedData = async (name, id) => {
    const resp = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/mmr/na/${name}/${id}`
    );
    const data = await resp.json();
    return data.data;
  };
  
  
  getRankedData("nugnug", "6135").then((data) => {
    console.log(data);
  });