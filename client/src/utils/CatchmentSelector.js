import React, { useMemo, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 350,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        paddingLeft: 0
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

const CatchmentSelector = ({ field, catchments, form, ...props }) => {
    const classes = useStyles();

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(catchments);
    const [right, setRight] = React.useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
          newChecked.push(value);
      } else {
          newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };
    
    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
      if (numberOfChecked(items) === items.length) {
          setChecked(not(checked, items));
      } else {
          setChecked(union(checked, items));
      }
    };

    const handleCheckedRight = () => {
        form.setFieldValue("catchments", right.concat(leftChecked).map(c => c.value));
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        form.setFieldValue("catchments", not(right, rightChecked).map(c => c.value));
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const CustomList = (props) => {
        let title = props.title;
        let items = props.items;
        
        return (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((catchment) => {
                    const labelId = `transfer-list-all-item-${catchment.value.catchment_id}-label`;

                    return (
                        <ListItem key={catchment.value.catchment_id} role="listitem" button onClick={handleToggle(catchment)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(catchment) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${catchment.value.name}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>);
    };

    return (
    <Grid
        container
        spacing={2}
        alignItems="center"
        className={classes.root}
    >
        <Grid item>
            <CustomList
                items={left}
                title="Select All">
            </CustomList>
        </Grid>
        <Grid item>
            <Grid container direction="column" alignItems="center">
                <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                >
                    &gt;
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                >
                    &lt;
                </Button>
            </Grid>
        </Grid>
        <Grid item>
            <CustomList
                    items={right}
                    title="Selected">
            </CustomList>
        </Grid>
    </Grid>);
}

export default CatchmentSelector;