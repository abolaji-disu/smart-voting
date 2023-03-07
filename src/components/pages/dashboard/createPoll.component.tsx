import PageContainer from "../../reusables/pageContainer.component";
import {IoIosArrowRoundBack} from "react-icons/io";
import InputField from "../../reusables/InputField.component";
import {AiFillPlusCircle} from "react-icons/ai";
import "./createPoll.styles.scss";
import { MouseEvent } from "react";
import React, {useState, useContext} from "react";
import {IoIosRemoveCircle} from "react-icons/io";
import DashboardHeader from "../../reusables/dashboard-header/dashboard-header";
import { HeaderInfo } from "../../reusables/dashboard-header/dashboard-header";
import {useLocation} from "react-router-dom";
import axios from "axios";
import { HeaderContext } from "../../../App";


type PollNumber = {
  id:number;
  name:string;
}

type candidatesOptions = {
candidateName: string,
}

type PollData = {
  title: string,
  question: string,
  startDateTime: string,
  endDateTime: string,
  category: string,
  candidates:candidatesOptions[];
}

const CreatePoll = () => {

  const { headerInfo, setHeaderInfo } = useContext(HeaderContext);



    const [inputField, setInputField] = useState<number>(0);
    const [newInputField, setNewInputField] = useState<PollNumber[]>([]);  

    const location = useLocation();
    console.log(location.state);
    

    const [createPollData, setCreatePollData] = useState<PollData>({
      title:"",
      question:"",
      startDateTime:"",
      endDateTime:"",
      category:"",
      candidates:[],
    })

    const [pollOptions, setPollOptions] = useState<candidatesOptions[]>([]);

    

    const handleAddField = (event: MouseEvent<Element>): void => {
      event.preventDefault();
      setInputField(prevInputField =>  prevInputField + 1); 
      setNewInputField([...newInputField, { id: inputField, name: "text"+inputField }]);
    }

    const handleDelete = (event: MouseEvent<Element>):void => {
      event.preventDefault();
      const targetId: string = (event.target as HTMLElement).id;
      setNewInputField(prevInputFields => prevInputFields.filter(inputField => inputField.name !== targetId));
      
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>):void => {
      e.preventDefault();
      const {name, value} = e.target;
      setCreatePollData(prevData => { 
       return {...prevData, [name]:value }})
    };


    const handleOptionsChange = ():void => {
      let elements:NodeListOf<HTMLInputElement> = document.querySelectorAll("input.add-poll");
      for (let i = 0; i < elements.length; i++) {
        // setPollOptions(prev => [...prev , {name: `${elements[i].value}`}]);
        pollOptions.push({candidateName: `${elements[i].value}`});
      }  
    }

    const buildRegData = () => {
       const startDate: string = createPollData.startDateTime.replace("T", " ") + ":00";
       const endDate: string =  createPollData.endDateTime.replace("T", " ") + ":00";

       handleOptionsChange();
        const buildPollData = {
          title: createPollData.title,
          question: createPollData.question,
          startDateTime: startDate,
          endDateTime: endDate,
          category: createPollData.category,
          candidates: pollOptions,
        };

        return buildPollData;
    }
    
    const handleSubmit = async (event:MouseEvent<Element>) => {
      event.preventDefault();
      const getData = buildRegData();
      console.log(getData);

      const headers = {
        'Authorization': 'Bearer'

      }
      
      
    await axios
      .post("https://africa-smart.onrender.com/api/v1/poll/create", getData, {headers})
      .then((res) => console.log(res))
      .then((err) => console.log(err));

      console.log("submit");
    }


    return (
      <>
        <PageContainer>
          <DashboardHeader {...headerInfo}/>
      
          <div className="poll-body">

            <form>
              <div className="poll-time">
                <div className="fieldLabel">Start Time</div>

                <InputField value={createPollData.startDateTime}
                  id="date-1"  type="datetime-local"  name="startDateTime"  holder="Enter Poll Start Time"  handleChange={handleChange} />

                <div className="fieldLabel">End Time</div>
                <InputField value={createPollData.endDateTime}
                  id="date-2"  type="datetime-local" name="endDateTime" holder="Enter Poll end Time"  handleChange={handleChange} />

              </div>

              <div className="fieldLabel">Poll Title</div>
              <InputField value={createPollData.title}
                id="poll-title"  type="text"  name="title"  holder="Enter Poll Title" handleChange={handleChange} />

              <div className="fieldLabel">Poll Questions</div>
              <InputField value={createPollData.question}
                id="poll-questions"   type="text"  name="question" holder="Enter Poll Question" handleChange={handleChange} />

              <div className="poll-options">
                <div className="fieldLabel">Add Poll Options</div>

                {newInputField.map((item) => (
                    <div className="options-btn" key={item.id}>
                      <input name="candidates" className="add-poll"   placeholder="enter options" type="text" key={item.id} />
                      <IoIosRemoveCircle className="delete-btn" id={item.name} onClick={handleDelete} />
                    </div>
                ))}
                <AiFillPlusCircle  className="plus-circle" onClick={handleAddField} />
                <div className="fieldLabel">Select your cohort</div>
                <select  name="category"  value={createPollData.category}  onChange={handleChange} >
                  <option value="cohort_I">cohort_I</option>
                  <option value="cohort_II">cohort_II</option>
                  <option value="cohort_III">cohort_III</option>
                  <option value="cohort_IV">cohort_IV</option>
                  <option value="cohort_V">cohort_V</option>
                </select>
              </div>
              <div className="submit" onClick={handleSubmit}>Submit</div>
            </form>
          </div>
        </PageContainer>
      </>
    );
    
}



export default CreatePoll;


