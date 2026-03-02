import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, InputLabel, ListSubheader } from '@mui/material';
import axios from 'axios';
import {API_URL} from "config/config.js";

const MasterTypeDropdown = ({ value, onChange, label = "Master Type" }) => {
    const [masterData, setMasterData] = useState({
        stone: {
            shape: [],
            size: [],
            name: [],
            color: [],
            cutting: [],
            quality: [],
            clarity: []
        },
        labour: [],
        other: []
    });

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const response = await axios.get(`${API_URL}/master`);
                const data = response.data;

                // Organize data by master_type
                const organized = {
                    stone: {
                        shape: [],
                        size: [],
                        name: [],
                        color: [],
                        cutting: [],
                        quality: [],
                        clarity: []
                    },
                    labour: [],
                    other: []
                };

                data.forEach(item => {
                    if (item.master_status === 'active') {  // Only include active items
                        switch (item.master_type) {
                            case 'master_stone_shape':
                                organized.stone.shape.push(item);
                                break;
                            case 'master_stone_size':
                                organized.stone.size.push(item);
                                break;
                            case 'master_stone_name':
                                organized.stone.name.push(item);
                                break;
                            case 'master_stone_color':
                                organized.stone.color.push(item);
                                break;
                            case 'master_stone_cutting':
                                organized.stone.cutting.push(item);
                                break;
                            case 'master_stone_quality':
                                organized.stone.quality.push(item);
                                break;
                            case 'master_stone_clarity':
                                organized.stone.clarity.push(item);
                                break;
                            case 'master_labour_type':
                                organized.labour.push(item);
                                break;
                            default:
                                organized.other.push(item);
                        }
                    }
                });

                setMasterData(organized);
            } catch (error) {
                console.error('Error fetching master data:', error);
            }
        };

        fetchMasterData();
    }, []);

    return (
        <FormControl fullWidth>
            <InputLabel id="master-type-select-label">{label}</InputLabel>
            <Select
                labelId="master-type-select-label"
                id="master-type-select"
                value={value || ''}
                label={label}
                onChange={onChange}
                sx={{
                    '& .MuiListSubheader-root': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold'
                    }
                }}
            >
                {/* Stone Related Options */}
                <ListSubheader>Stone</ListSubheader>
                {masterData.stone.shape.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Shape)
                    </MenuItem>
                ))}
                {masterData.stone.size.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Size)
                    </MenuItem>
                ))}
                {masterData.stone.name.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Stone)
                    </MenuItem>
                ))}
                {masterData.stone.color.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Color)
                    </MenuItem>
                ))}
                {masterData.stone.cutting.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Cutting)
                    </MenuItem>
                ))}
                {masterData.stone.quality.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Quality)
                    </MenuItem>
                ))}
                {masterData.stone.clarity.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                        {item.code} - {item.name} (Clarity)
                    </MenuItem>
                ))}

                {/* Labour Options */}
                {masterData.labour.length > 0 && (
                    <>
                        <ListSubheader>Labour</ListSubheader>
                        {masterData.labour.map(item => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.code} - {item.name}
                            </MenuItem>
                        ))}
                    </>
                )}

                {/* Other Options */}
                {masterData.other.length > 0 && (
                    <>
                        <ListSubheader>Other</ListSubheader>
                        {masterData.other.map(item => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.code} - {item.name}
                            </MenuItem>
                        ))}
                    </>
                )}
            </Select>
        </FormControl>
    );
};

export default MasterTypeDropdown; 