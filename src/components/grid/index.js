import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import "./grid.css"
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid(props) {
  return ( 
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className='GridMainContainer'>
        <Grid item xs={10} sm={6} md={4} lg={3} >
          <Item className="postsItemsGrid" id="allPostsGrid" >
            <h1>All Posts</h1>{props.all}</Item>
        </Grid>
        <Grid item xs={10} sm={6} md={4} lg={3}>
          <Item className="postsItemsGrid" id="approvePostsgrid"><h1>Approved Posts</h1>{props.approved}</Item>
        </Grid>
        <Grid item xs={10} sm={6} md={4} lg={3}>
          <Item className="postsItemsGrid" id="pendingpostsgrid"><h1>Pending Posts</h1>{props.pending}</Item>
        </Grid>
        <Grid item xs={10} sm={6} md={4} lg={3}>
          <Item className="postsItemsGrid" id="rejectPostsgrid"><h1>Rejected Posts</h1>{props.rejected}</Item>
        </Grid>
       
      </Grid>
    </Box>
  );
}