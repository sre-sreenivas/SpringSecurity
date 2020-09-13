package com.in28minutes.jpa.hibernate.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.in28minutes.jpa.hibernate.demo.entity.Student;


@RepositoryRestResource(path="students")
public interface StudentSpringDataRepository extends JpaRepository<Student, Long> {
	  List<Student> findByNameAndId(String name, Long id);
	  List<Student> findByName(String name);
	  long count();
	  List<Student> countByName(String name);
	  List<Student> findByNameOrderByIdDesc(String name);
	  List<Student> deleteByName(String name);
	/*
	@Query("Select  c  From Student c where name like '%100 Steps'")
	List<Student> courseWith100StepsInName();
	@Query(value = "Select  *  From Student c where name like '%100 Steps'",
	nativeQuery = true) List<Student> courseWith100StepsInNameUsingNativeQuery();
	@Query(name = "query_get_100_Step_studets") List<Student>
	courseWith100StepsInNameUsingNamedQuery();
	*/
}
