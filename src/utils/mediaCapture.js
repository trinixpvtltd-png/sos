import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PHOTO_CAMERA_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 0.8,
};

const VIDEO_CAMERA_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  allowsEditing: false,
  videoMaxDuration: 60,
};

const PHOTO_LIBRARY_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: false,
  allowsEditing: false,
  quality: 0.8,
};

const VIDEO_LIBRARY_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  allowsMultipleSelection: false,
  allowsEditing: false,
};

const getAttachmentType = (asset, fallbackType = 'photo') => {
  const mimeType = asset.mimeType || asset.type || '';

  if (typeof mimeType === 'string' && mimeType.startsWith('video/')) {
    return 'video';
  }

  if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
    return 'photo';
  }

  if (asset.type === 'video') {
    return 'video';
  }

  if (asset.type === 'image' || asset.type === 'photo') {
    return 'photo';
  }

  return fallbackType;
};

const buildAttachment = (asset, source = 'camera', fallbackType = 'photo') => {
  const attachmentType = getAttachmentType(asset, fallbackType);
  const extensionFromMime = asset.mimeType ? asset.mimeType.split('/')[1] : null;
  const extension = extensionFromMime || (attachmentType === 'video' ? 'mp4' : 'jpg');
  const name = asset.fileName || `${source}_${Date.now()}.${extension}`;

  return {
    id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: attachmentType,
    name,
    uri: asset.uri,
    mimeType: asset.mimeType || (attachmentType === 'video' ? 'video/mp4' : 'image/jpeg'),
    width: asset.width,
    height: asset.height,
    duration: asset.duration,
    source,
  };
};

const mapCancelled = () => ({
  ok: false,
  reason: 'cancelled',
});

const mapPermissionDenied = () => ({
  ok: false,
  reason: 'permission_denied',
});

const mapUnavailable = () => ({
  ok: false,
  reason: 'unavailable',
});

const buildWebAttachment = (file, source = 'camera', fallbackType = 'photo') => {
  const attachmentType = getAttachmentType(file, fallbackType);

  return {
    id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: attachmentType,
    name: file.name || `${source}_${Date.now()}.${attachmentType === 'video' ? 'mp4' : 'jpg'}`,
    uri: URL.createObjectURL(file),
    mimeType: file.type || (attachmentType === 'video' ? 'video/mp4' : 'image/jpeg'),
    width: undefined,
    height: undefined,
    duration: undefined,
    source,
  };
};

const createWebFileFromBlob = (blob, name, type) => {
  if (typeof File !== 'undefined') {
    return new File([blob], name, { type });
  }

  return Object.assign(blob, { name, type });
};

const openWebCameraCapture = (options = {}) => new Promise(async (resolve) => {
  if (
    typeof document === 'undefined'
    || typeof navigator === 'undefined'
    || !navigator.mediaDevices?.getUserMedia
  ) {
    resolve(mapUnavailable());
    return;
  }

  let settled = false;
  let stream;

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '2147483647';
  overlay.style.background = 'rgba(10, 10, 12, 0.82)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';

  const frame = document.createElement('div');
  frame.style.width = '100%';
  frame.style.maxWidth = '420px';
  frame.style.background = 'rgba(255, 255, 255, 0.96)';
  frame.style.borderRadius = '24px';
  frame.style.padding = '14px';
  frame.style.boxSizing = 'border-box';
  frame.style.boxShadow = '0 20px 48px rgba(0, 0, 0, 0.28)';
  frame.style.display = 'flex';
  frame.style.flexDirection = 'column';
  frame.style.gap = '12px';

  const video = document.createElement('video');
  video.setAttribute('autoplay', 'true');
  video.setAttribute('playsinline', 'true');
  video.muted = true;
  video.style.width = '100%';
  video.style.minHeight = '280px';
  video.style.maxHeight = '72vh';
  video.style.objectFit = 'cover';
  video.style.borderRadius = '18px';
  video.style.background = '#111';

  const actionRow = document.createElement('div');
  actionRow.style.display = 'flex';
  actionRow.style.gap = '10px';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = options.cancelLabel || 'Cancel';
  cancelButton.style.flex = '1';
  cancelButton.style.height = '46px';
  cancelButton.style.border = '1px solid rgba(0, 0, 0, 0.08)';
  cancelButton.style.borderRadius = '14px';
  cancelButton.style.background = '#fff';
  cancelButton.style.color = '#222';
  cancelButton.style.fontSize = '14px';
  cancelButton.style.fontWeight = '600';
  cancelButton.style.cursor = 'pointer';

  const captureButton = document.createElement('button');
  captureButton.type = 'button';
  captureButton.textContent = options.captureLabel || 'Capture';
  captureButton.style.flex = '1.2';
  captureButton.style.height = '46px';
  captureButton.style.border = '0';
  captureButton.style.borderRadius = '14px';
  captureButton.style.background = '#ff3b30';
  captureButton.style.color = '#fff';
  captureButton.style.fontSize = '14px';
  captureButton.style.fontWeight = '700';
  captureButton.style.cursor = 'pointer';

  actionRow.appendChild(cancelButton);
  actionRow.appendChild(captureButton);
  frame.appendChild(video);
  frame.appendChild(actionRow);
  overlay.appendChild(frame);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  const finish = (result) => {
    if (settled) {
      return;
    }

    settled = true;
    cleanup();
    resolve(result);
  };

  overlay.onclick = (event) => {
    if (event.target === overlay) {
      finish(mapCancelled());
    }
  };

  cancelButton.onclick = () => finish(mapCancelled());

  captureButton.onclick = () => {
    if (!video.videoWidth || !video.videoHeight) {
      finish(mapUnavailable());
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      finish(mapUnavailable());
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        finish(mapUnavailable());
        return;
      }

      const timestamp = Date.now();
      const file = createWebFileFromBlob(blob, `camera_${timestamp}.jpg`, 'image/jpeg');
      finish({
        ok: true,
        attachment: buildWebAttachment(file, 'camera', 'photo'),
      });
    }, 'image/jpeg', 0.92);
  };

  document.body.appendChild(overlay);

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
      },
    });
    video.srcObject = stream;
    await video.play();
  } catch (error) {
    const errorName = error?.name || '';
    finish(
      errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError'
        ? mapPermissionDenied()
        : mapUnavailable(),
    );
  }
});

const openWebFileInput = (options = {}) => new Promise((resolve) => {
  if (typeof document === 'undefined') {
    resolve(mapUnavailable());
    return;
  }

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = options.accept || 'image/*';

  if (options.capture) {
    input.setAttribute('capture', options.capture);
  }

  input.style.position = 'fixed';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  input.style.width = '1px';
  input.style.height = '1px';

  let settled = false;

  const cleanup = () => {
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
    window.removeEventListener('focus', handleFocus);
  };

  const finish = (result) => {
    if (settled) {
      return;
    }

    settled = true;
    cleanup();
    resolve(result);
  };

  const handleFocus = () => {
    setTimeout(() => {
      if (!settled && !input.files?.length) {
        finish(mapCancelled());
      }
    }, 500);
  };

  input.onchange = () => {
    const selectedFile = input.files?.[0];
    if (!selectedFile) {
      finish(mapCancelled());
      return;
    }

    finish({
      ok: true,
      attachment: buildWebAttachment(
        selectedFile,
        options.source || 'camera',
        options.attachmentType || 'photo',
      ),
    });
  };

  document.body.appendChild(input);
  window.addEventListener('focus', handleFocus);
  input.click();
});

export const captureImageWithCamera = async () => {
  try {
    if (Platform.OS === 'web') {
      return await openWebCameraCapture();
    }

    if (Platform.OS !== 'web') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        return mapPermissionDenied();
      }
    }

    const result = await ImagePicker.launchCameraAsync(PHOTO_CAMERA_OPTIONS);
    if (result.canceled || !result.assets?.length) {
      return mapCancelled();
    }

    return {
      ok: true,
      attachment: buildAttachment(result.assets[0], 'camera', 'photo'),
    };
  } catch (error) {
    return mapUnavailable();
  }
};

export const captureVideoWithCamera = async () => {
  try {
    if (Platform.OS === 'web') {
      return await openWebFileInput({
        accept: 'video/*',
        capture: 'environment',
        source: 'camera',
        attachmentType: 'video',
      });
    }

    if (Platform.OS !== 'web') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        return mapPermissionDenied();
      }
    }

    const result = await ImagePicker.launchCameraAsync(VIDEO_CAMERA_OPTIONS);
    if (result.canceled || !result.assets?.length) {
      return mapCancelled();
    }

    return {
      ok: true,
      attachment: buildAttachment(result.assets[0], 'camera', 'video'),
    };
  } catch (error) {
    return mapUnavailable();
  }
};

export const pickImageFromLibrary = async () => {
  try {
    if (Platform.OS === 'web') {
      return await openWebFileInput({
        accept: 'image/*',
        source: 'library',
        attachmentType: 'photo',
      });
    }

    if (Platform.OS !== 'web') {
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!mediaPermission.granted) {
        return mapPermissionDenied();
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync(PHOTO_LIBRARY_OPTIONS);
    if (result.canceled || !result.assets?.length) {
      return mapCancelled();
    }

    return {
      ok: true,
      attachment: buildAttachment(result.assets[0], 'library', 'photo'),
    };
  } catch (error) {
    return mapUnavailable();
  }
};

export const pickVideoFromLibrary = async () => {
  try {
    if (Platform.OS === 'web') {
      return await openWebFileInput({
        accept: 'video/*',
        source: 'library',
        attachmentType: 'video',
      });
    }

    if (Platform.OS !== 'web') {
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!mediaPermission.granted) {
        return mapPermissionDenied();
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync(VIDEO_LIBRARY_OPTIONS);
    if (result.canceled || !result.assets?.length) {
      return mapCancelled();
    }

    return {
      ok: true,
      attachment: buildAttachment(result.assets[0], 'library', 'video'),
    };
  } catch (error) {
    return mapUnavailable();
  }
};
