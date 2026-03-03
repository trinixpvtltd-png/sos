export const defaultPermissionsStatus = {
  location: {
    key: 'location',
    title: 'Location',
    enabled: true,
    required: true,
    description: 'Needed to share live location during SOS incidents.',
  },
  notifications: {
    key: 'notifications',
    title: 'Notifications',
    enabled: true,
    required: true,
    description: 'Needed for case updates and contact alert confirmations.',
  },
  microphone: {
    key: 'microphone',
    title: 'Microphone',
    enabled: false,
    required: false,
    description: 'Optional voice evidence and ambient capture during emergencies.',
  },
  camera: {
    key: 'camera',
    title: 'Camera',
    enabled: false,
    required: false,
    description: 'Optional photo and video evidence capture.',
  },
};
