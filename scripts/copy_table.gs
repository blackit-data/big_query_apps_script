function copy_table(source_projectId,source_datasetId,source_tableId,dest_projectId,dest_datasetId,dest_tableId) {
 /*
 // Example inputs
  // SOURCE
  var source_projectId ='your_project' 
  var source_datasetId ='your_dataset1'
  var source_tableId ='your_table2'
  
  // DESTINATION
  var dest_projectId ='your_project'
  var dest_datasetId ='your_dataset1'
  var dest_tableId ='your_table3'
  
  */
  
  // Define the inserting job
  var job = {
    configuration: {
      copy: {
        sourceTable:{
          projectId: source_projectId,
          datasetId: source_datasetId,
          tableId: source_tableId
        },  
        destinationTable: {
          projectId: dest_projectId,
          datasetId: dest_datasetId,
          tableId: dest_tableId
        }
      }
    }
  };

// Execute inserting job  
var copy = BigQuery.Jobs.insert(job, dest_projectId);
}
