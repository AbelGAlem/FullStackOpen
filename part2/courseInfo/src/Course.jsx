const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map((part) => 
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({total}) => <p>A total of {total} exercises</p>

const Course = ({course}) => {
    const total =  course.parts.reduce((s, p) => {
        return s + p.exercises
    }, 0)
    return (  
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total total={total}/>
        </div>
    )
}

export default Course