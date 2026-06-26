import fs from 'fs';

['temp_chemistryData.js', 'update_data.js', 'update_data2.js', 'update_data3.js', 'update_data4.js', 'update_data5.cjs', 'update_data6.cjs', 'update_data7.cjs', 'update_data8.cjs', 'update_data9.cjs', 'update_data10.cjs'].forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`- ${file}: exists, size: ${fs.statSync(file).size} bytes`);
  } else {
    console.log(`- ${file}: does not exist`);
  }
});
