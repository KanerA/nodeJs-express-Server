
  if(!binsDirExist){ // if the bins directory does not exist, it creates one
    fs.mkdirSync('./bins');
  }
  const binsDirExist = fs.existsSync(`./bins`);