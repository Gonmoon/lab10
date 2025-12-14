import React from 'react';

interface PhotoModalProps {
  isOpen: boolean;
  photoUrl: string;
  alt?: string;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  photoUrl,
  alt = 'Фото',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{alt}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <img
            src={photoUrl}
            alt={alt}
            className="detail-photo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNNjUgNjVIMTM1VjEzNUg2NVY2NVoiIGZpbGw9IiNjY2NjY2MiLz48L3N2Zz4=';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;