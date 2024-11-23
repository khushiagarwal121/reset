export default  (field) => {
      return (value) => {
        if (value) return true;
        else return `${field} is a required field `;
      };
    }