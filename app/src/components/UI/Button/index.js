import './button.css'
import { AiOutlineSearch } from 'react-icons/ai'
const Button = ({ txtButton, onClick, disabled }) => {
  return (
    <button
      className="btn btn-primary"
      disabled={disabled}
      onClick={() => onClick()}
    >
      <AiOutlineSearch /> <span className="txtButton">{txtButton}</span>
    </button>
  )
}
export default Button
