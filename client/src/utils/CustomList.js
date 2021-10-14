import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

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

const CustomList = ({title, items, handleToggle, handleToggleAll, checked, numberOfChecked }) => {
    const classes = useStyles();

    return (
    <Card>
        <CardHeader
            className={classes.cardHeader}
            avatar={
                <Checkbox
                    onClick={() => handleToggleAll(items)}
                    checked={numberOfChecked(items) === items.length && items.length !== 0}
                    indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                    disabled={items.length === 0}
                    inputProps={{ 'aria-label': 'all items selected' }}
                />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selected`}>
        </CardHeader>
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

export default CustomList;