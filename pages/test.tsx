export default function Test() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Eco Dairy Bot Test Page</h1>
      <p>If you can see this, the server is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
      <button onClick={() => alert('JavaScript is working!')}>
        Test JavaScript
      </button>
    </div>
  );
}