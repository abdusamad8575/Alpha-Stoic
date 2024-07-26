"use client"; 

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Edit, Delete } from '@mui/icons-material';
import {
  Button, Modal, TextField, Box, Pagination, IconButton, Grid, Card, CardContent, CardMedia, Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import './style.css';

const BACK_URL = "https://backend.alphastoic.in";
// const BACK_URL = "http://localhost:5000";

interface Event {
  _id: string;
  eventName: string;
  text: string;
  features: string[];
  images: string[];
  price: string;
  duration:string;
  type:string;
  date: string;
}

const Events = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    eventName: string;
    text: string;
    features: string[];
    images: File[];
    price: string;
    duration:string;
    type:string;
    date: Dayjs | null;
    imagePreviews: string[];
  }>({
    eventName: '',
    text: '',
    features: [''],
    images: [],
    price: '',
    duration:'',
    type:' ',
    date: null,
    imagePreviews: []
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const maxFeatures = 6;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get(`${BACK_URL}/events`);
    setEvents(response.data);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prevData => ({ ...prevData, features: newFeatures }));
  };

  const handleAddFeature = () => {
    setFormData(prevData => ({ ...prevData, features: [...prevData.features, ''] }));
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prevData => ({ ...prevData, features: newFeatures }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map(img => URL.createObjectURL(img));
    setFormData(prevData => ({ ...prevData, images: [...prevData.images, ...files],
      imagePreviews: [...prevData.imagePreviews, ...previews]
     }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setFormData({ eventName: '', text: '', features: [''], images: [], price: '',duration:'',type:'', date: null,imagePreviews: [] });
  };

  const handleSubmit = async () => {
    const eventData = new FormData();
    eventData.append('eventName', formData.eventName);
    eventData.append('text', formData.text);
    formData.features.forEach(feature => eventData.append('features', feature));
    formData.images.forEach(image => eventData.append('images', image));
    eventData.append('price', formData.price);
    eventData.append('duration', formData.duration);
    eventData.append('type', formData.type);
    eventData.append('date', formData.date ? formData.date.toISOString() : '');

    if (isEditing && editingEventId) {
      await axios.put(`${BACK_URL}/events/${editingEventId}`, eventData);
    } else {
      await axios.post(`${BACK_URL}/events`, eventData);
    }
    fetchEvents();
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${BACK_URL}/events/${id}`);
    fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setOpen(true);
    setIsEditing(true);
    setEditingEventId(event._id);
    setFormData({
      eventName: event.eventName,
      text: event.text,
      features: event.features,
      images: [],
      price: event.price,
      duration: event.duration,
      type: event.type,
      date: dayjs(event.date),
      imagePreviews: event.images.map(img => `${BACK_URL}/uploads/${img}`)
    });
  };

  const totalPages = Math.ceil(events.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const selectedEvents = events.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="products">
      <div className="info" style={{ marginBottom: '20px' }}>
        <h1>Events</h1>
        <Button onClick={handleOpen} className="addBtn" variant="contained" color="success">
          Add new Event
        </Button>
      </div>
      <Grid container spacing={2} justifyContent="center">
        {selectedEvents.length !== 0 ? (selectedEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id} className='card' style={{ display: 'flex' }}>
            <Card style={{ display: 'flex', flexDirection: 'column', flex: 1, border: '1px solid black' }}>
              <CardMedia>
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                  {event.images.map((src, index) => (
                    <div key={index}>
                      <img src={`${BACK_URL}/uploads/${src}`} alt={event.eventName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </div>
                  ))}
                </Carousel>
              </CardMedia>
              <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: "5px" }}>
                <Typography gutterBottom variant="h5" component="div" className='card2'>
                  {event.eventName}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ flex: 1 }}>
                  {event.text}
                </Typography>
                <ul>
                  {event.features.slice(0, maxFeatures).map((feature, index) => (
                    <li style={{ color: 'black' }} key={index}>{feature}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    ₹{event.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.date}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Duration:{event.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type:{event.type}
                  </Typography>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton color="primary" onClick={() => handleEdit(event)}><Edit /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(event._id)}><Delete /></IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))) : (<span>Please add Events</span>)
        }
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="add-event-modal-title"
        aria-describedby="add-event-modal-description"
      >
        <Box sx={{ ...modalStyle, maxHeight: '80%', overflowY: 'auto' }}>
          <h2 id="add-event-modal-title">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
          <TextField
            label="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          {/* {formData.features.map((feature, index) => (
            <TextField
              key={index}
              label={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ))} */}
          {formData.features.map((feature, index) => (
            <Box key={index} display="flex" alignItems="center">
              <TextField
                label={`Feature ${index + 1}`}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
              {formData.features.length > 1 && (
                <IconButton onClick={() => handleRemoveFeature(index)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button onClick={handleAddFeature} variant="contained" color="primary" fullWidth className="mt-4">
            Add Feature
          </Button>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            style={{ display: 'block', margin: '20px 0' }}
            required
          />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {formData.imagePreviews.map((preview, index) => (
              <Grid item xs={6} key={index}>
                <Box position="relative">
                  <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  {/* <IconButton
                    color="secondary"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <Delete />
                  </IconButton> */}
                </Box>
              </Grid>
            ))}
          </Grid>
          <TextField
            label="Price"
            name="price"
            value={formData?.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Event Duration"
            name="duration"
            value={formData?.duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Event Type"
            name="type"
            value={formData?.type}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['DateTimeField']}
            >
              <DateTimeField
                label="Select Date and Time"
                onChange={(date) => setFormData(prevData => ({ ...prevData, date }))}
                format="L hh:mm a"
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button onClick={handleSubmit} variant="contained" color="success" fullWidth className="mt-5">
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Events;
