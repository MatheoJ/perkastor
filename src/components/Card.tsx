const Card = ({ title, description }) => {
  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '16px', marginBottom: '16px' }}>
      <h2 style={{ margin: '0' }}>{title}</h2>
      <p style={{ margin: '0' }}>{description}</p>
    </div>
  );
};

export default Card;
